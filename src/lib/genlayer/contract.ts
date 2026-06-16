// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenLayerClient = any;

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  console.error("VITE_CONTRACT_ADDRESS is not set in .env");
}

function toLower(a: string): `0x${string}` {
  return a.toLowerCase() as `0x${string}`;
}

function mapContractResult(val: unknown): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === "object" && !Array.isArray(val)) {
    const obj = val as Record<string, unknown>;
    if (obj.type === "BigInt" || obj.type === "bigint") return Number(obj.value ?? obj);
    if (obj.value !== undefined) return obj.value;
    if (obj.inner !== undefined) return obj.inner;
  }
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  if (typeof val === "object" && val !== null) {
    const normalized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const vObj = v as Record<string, unknown>;
        if (vObj.type === "BigInt" || vObj.type === "bigint") {
          normalized[k] = Number(vObj.value ?? v);
        } else {
          normalized[k] = mapContractResult(v);
        }
      } else {
        normalized[k] = v;
      }
    }
    return normalized;
  }
  return val;
}

async function readContractWithRetry(
  client: GenLayerClient,
  contractAddress: string,
  functionName: string,
  args: unknown[],
  retries = 10,
): Promise<unknown> {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.readContract({
        address: contractAddress as `0x${string}`,
        functionName,
        args,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("Server busy") || msg.includes("execution slots")) {
        const wait = Math.min(3000 * (i + 1), 15000);
        console.warn(`[Contract] ${functionName} server busy, retrying in ${wait}ms (${i + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw new Error(`[Contract] ${functionName} failed after ${retries} retries`);
}

async function writeContract(
  client: GenLayerClient,
  address: string,
  functionName: string,
  args: unknown[],
): Promise<string> {
  console.log(
    `[Contract] writeContract: ${functionName}(${JSON.stringify(args).substring(0, 200)})`,
  );

  const txHash = await client.writeContract({
    address: address as `0x${string}`,
    functionName,
    args,
    value: BigInt(0),
  });
  console.log(`[Contract] TX submitted: ${txHash}`);
  return txHash;
}

async function waitForReceipt(
  client: GenLayerClient,
  txHash: string,
  retries = 60,
  interval = 5000,
) {
  console.log(`[Contract] waiting for receipt (${retries} retries × ${interval}ms)...`);
  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: "ACCEPTED",
    retries,
    interval,
  });
  console.log(`[Contract] TX confirmed: ${receipt?.transactionHash}, status: ${receipt?.status}`);
  return receipt;
}

export interface VoteData {
  proposal: string;
  vote: string;
  context: string;
  difficulty: number;
}

export interface SessionResult {
  correct: number;
  total: number;
  score: number;
  gen: number;
}

export class AetherisGameContract {
  private client: GenLayerClient;
  private address: string;

  constructor(client: GenLayerClient) {
    this.client = client;
    this.address = CONTRACT_ADDRESS;
    console.log("[Contract] Address:", this.address);
  }

  async register(alias: string) {
    const hash = await writeContract(this.client, this.address, "register", [alias]);
    return await waitForReceipt(this.client, hash);
  }

  async startSession() {
    const hash = await writeContract(this.client, this.address, "start_session", []);
    return await waitForReceipt(this.client, hash);
  }

  async evaluateSession(votes: VoteData[]): Promise<SessionResult> {
    const votesJson = JSON.stringify(votes);
    const addr = (await this.client.account?.address) || "";
    const addrLower = addr.toLowerCase();
    console.log("[Contract] evaluateSession with", votes.length, "votes for", addrLower);

    // 1. Submit TX and wait for receipt (TX confirmed on-chain)
    const txHash = await writeContract(this.client, this.address, "evaluate_session", [votesJson]);
    console.log("[Contract] evaluate_session TX submitted, waiting for receipt...");

    await waitForReceipt(this.client, txHash, 60, 5000);
    console.log("[Contract] TX confirmed, polling for AI consensus result...");

    // 2. Poll get_session_result until AI consensus is done (up to 5 minutes)
    for (let i = 0; i < 60; i++) {
      try {
        const result = await this.getSessionResult(addrLower);
        if (result && result !== "") {
          console.log(`[Contract] AI consensus result (${i + 1}/60):`, result);
          return JSON.parse(result);
        }
      } catch (e) {
        console.log(`[Contract] polling error (${i + 1}/60):`, e);
      }
      await new Promise((r) => setTimeout(r, 5000));
      if ((i + 1) % 12 === 0) {
        console.log(`[Contract] still waiting for AI consensus... (${(i + 1) * 5}s elapsed)`);
      }
    }

    console.warn("[Contract] polling timeout after 5 minutes");
    return { correct: 0, total: votes.length, score: 0, gen: 0 };
  }

  async updateConfig(base: number, streak: number, penalty: number) {
    const hash = await writeContract(this.client, this.address, "update_config", [
      BigInt(base),
      BigInt(streak),
      BigInt(penalty),
    ]);
    return await waitForReceipt(this.client, hash);
  }

  async isRegistered(addr: string): Promise<boolean> {
    const raw = await readContractWithRetry(this.client, this.address, "is_registered", [toLower(addr)]);
    return !!mapContractResult(raw);
  }

  async getGen(addr: string): Promise<number> {
    const raw = await readContractWithRetry(this.client, this.address, "get_gen", [toLower(addr)]);
    return Number(mapContractResult(raw) ?? 0);
  }

  async getRep(addr: string): Promise<number> {
    const raw = await readContractWithRetry(this.client, this.address, "get_rep", [toLower(addr)]);
    return Number(mapContractResult(raw) ?? 0);
  }

  async getScore(addr: string): Promise<number> {
    const raw = await readContractWithRetry(this.client, this.address, "get_score", [toLower(addr)]);
    return Number(mapContractResult(raw) ?? 0);
  }

  async getStats(addr: string): Promise<string> {
    const raw = await readContractWithRetry(this.client, this.address, "get_stats", [toLower(addr)]);
    return String(mapContractResult(raw) ?? "not found");
  }

  async hasActiveSession(addr: string): Promise<boolean> {
    const raw = await readContractWithRetry(this.client, this.address, "has_active_session", [toLower(addr)]);
    return !!mapContractResult(raw);
  }

  async getSessionResult(addr: string): Promise<string> {
    const raw = await readContractWithRetry(this.client, this.address, "get_session_result", [toLower(addr)]);
    const mapped = mapContractResult(raw);
    return typeof mapped === "string" ? mapped : JSON.stringify(mapped ?? "");
  }

  async getTotalPlayers(): Promise<number> {
    const raw = await readContractWithRetry(this.client, this.address, "get_total_players", []);
    return Number(mapContractResult(raw) ?? 0);
  }

  async getTotalGames(): Promise<number> {
    const raw = await readContractWithRetry(this.client, this.address, "get_total_games", []);
    return Number(mapContractResult(raw) ?? 0);
  }

  async getTotalVotes(): Promise<number> {
    const raw = await readContractWithRetry(this.client, this.address, "get_total_votes", []);
    return Number(mapContractResult(raw) ?? 0);
  }

  async getPlayerName(addr: string): Promise<string> {
    const raw = await readContractWithRetry(this.client, this.address, "get_player_name", [toLower(addr)]);
    return String(mapContractResult(raw) ?? "");
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const raw = await readContractWithRetry(this.client, this.address, "get_leaderboard", []);
    const mapped = mapContractResult(raw);
    if (typeof mapped === "string") {
      try { return JSON.parse(mapped); } catch { return []; }
    }
    if (Array.isArray(mapped)) return mapped as LeaderboardEntry[];
    return [];
  }
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  accuracy: number;
  address: string;
}
