const CONTRACT_ADDRESS = "0x22c2E759B7688EA1013c34Ab92744cb001d7f71f";
function toLower(a) {
  return a.toLowerCase();
}
function mapContractResult(val) {
  if (val === null || val === void 0) return null;
  if (typeof val === "object" && !Array.isArray(val)) {
    const obj = val;
    if (obj.type === "BigInt" || obj.type === "bigint") return Number(obj.value ?? obj);
    if (obj.value !== void 0) return obj.value;
    if (obj.inner !== void 0) return obj.inner;
  }
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch (_) {
      return val;
    }
  }
  if (typeof val === "object" && val !== null) {
    const normalized = {};
    for (const [k, v] of Object.entries(val)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const vObj = v;
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
async function readContractWithRetry(client, contractAddress, functionName, args, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.readContract({
        address: contractAddress,
        functionName,
        args
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("Server busy") || msg.includes("execution slots")) {
        const wait = Math.min(3e3 * (i + 1), 15e3);
        console.warn(`[Contract] ${functionName} server busy, retrying in ${wait}ms (${i + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw new Error(`[Contract] ${functionName} failed after ${retries} retries`);
}
async function writeContract(client, address, functionName, args) {
  console.log(
    `[Contract] writeContract: ${functionName}(${JSON.stringify(args).substring(0, 200)})`
  );
  const txHash = await client.writeContract({
    address,
    functionName,
    args,
    value: BigInt(0)
  });
  console.log(`[Contract] TX submitted: ${txHash}`);
  return txHash;
}
async function waitForReceipt(client, txHash, retries = 60, interval = 5e3) {
  console.log(`[Contract] waiting for receipt (${retries} retries × ${interval}ms)...`);
  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: "ACCEPTED",
    retries,
    interval
  });
  console.log(`[Contract] TX confirmed: ${receipt?.transactionHash}, status: ${receipt?.status}`);
  return receipt;
}
class AetherisGameContract {
  client;
  address;
  constructor(client) {
    this.client = client;
    this.address = CONTRACT_ADDRESS;
    console.log("[Contract] Address:", this.address);
  }
  async register(alias) {
    const hash = await writeContract(this.client, this.address, "register", [alias]);
    return await waitForReceipt(this.client, hash);
  }
  async startSession() {
    const hash = await writeContract(this.client, this.address, "start_session", []);
    return await waitForReceipt(this.client, hash);
  }
  async evaluateVote(vote) {
    console.log("[Contract] evaluateVote:", vote.vote, "on proposal:", vote.proposal.substring(0, 50));
    const addr = await this.client.account?.address || "";
    const addrLower = addr.toLowerCase();
    let prevVoteCount = 0;
    try {
      const rawStats = await readContractWithRetry(this.client, this.address, "get_session_stats", [addrLower]);
      const mappedStats = mapContractResult(rawStats);
      if (mappedStats && typeof mappedStats === "object") {
        prevVoteCount = Number(mappedStats.total || 0);
      }
    } catch (e) {
      console.log("[Contract] could not read prev vote count:", e);
    }
    const txHash = await writeContract(this.client, this.address, "evaluate_vote", [
      vote.proposal,
      vote.vote,
      vote.context
    ]);
    await waitForReceipt(this.client, txHash, 60, 5e3);
    console.log("[Contract] evaluate_vote TX confirmed, reading result...");
    for (let i = 0; i < 20; i++) {
      try {
        const raw = await readContractWithRetry(this.client, this.address, "get_last_vote_result", [addrLower]);
        const mapped = mapContractResult(raw);
        if (mapped && typeof mapped === "string" && (mapped === "correct" || mapped === "wrong")) {
          try {
            const rawStats = await readContractWithRetry(this.client, this.address, "get_session_stats", [addrLower]);
            const mappedStats = mapContractResult(rawStats);
            if (mappedStats && typeof mappedStats === "object") {
              const newVoteCount = Number(mappedStats.total || 0);
              if (newVoteCount > prevVoteCount) {
                const isCorrect = mapped === "correct";
                console.log("[Contract] evaluateVote result:", { correct: isCorrect });
                return { correct: isCorrect, streak: 0, result: mapped };
              }
            }
          } catch (e) {
            const isCorrect = mapped === "correct";
            console.log("[Contract] evaluateVote result (unverified):", { correct: isCorrect });
            return { correct: isCorrect, streak: 0, result: mapped };
          }
        }
      } catch (e) {
        console.log(`[Contract] evaluateVote poll (${i + 1}/20):`, e);
      }
      await new Promise((r) => setTimeout(r, 2e3));
    }
    return { correct: false, streak: 0, result: "unknown" };
  }
  async endSession() {
    console.log("[Contract] endSession");
    const txHash = await writeContract(this.client, this.address, "end_session", []);
    await waitForReceipt(this.client, txHash, 60, 5e3);
    const addr = await this.client.account?.address || "";
    const addrLower = addr.toLowerCase();
    for (let i = 0; i < 30; i++) {
      try {
        const raw = await readContractWithRetry(this.client, this.address, "get_session_stats", [addrLower]);
        const mapped = mapContractResult(raw);
        if (mapped && typeof mapped === "object") {
          const stats = mapped;
          if (Number(stats.total) > 0) {
            console.log("[Contract] endSession result:", stats);
            return {
              correct: Number(stats.correct),
              total: Number(stats.total),
              score: Number(stats.score),
              gen: Number(stats.gen),
              accuracy: 0
            };
          }
        }
      } catch (e) {
        console.log(`[Contract] endSession poll (${i + 1}/30):`, e);
      }
      await new Promise((r) => setTimeout(r, 3e3));
    }
    return { correct: 0, total: 0, score: 0, gen: 0, accuracy: 0 };
  }
  async isRegistered(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "is_registered", [toLower(addr)]);
    return !!mapContractResult(raw);
  }
  async getGen(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "get_gen", [toLower(addr)]);
    return Number(mapContractResult(raw) ?? 0);
  }
  async getRep(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "get_rep", [toLower(addr)]);
    return Number(mapContractResult(raw) ?? 0);
  }
  async getScore(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "get_score", [toLower(addr)]);
    return Number(mapContractResult(raw) ?? 0);
  }
  async getStats(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "get_stats", [toLower(addr)]);
    return String(mapContractResult(raw) ?? "not found");
  }
  async hasActiveSession(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "has_active_session", [toLower(addr)]);
    return !!mapContractResult(raw);
  }
  async getPlayerName(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "get_player_name", [toLower(addr)]);
    return String(mapContractResult(raw) ?? "");
  }
  async getCumulativeStats(addr) {
    const raw = await readContractWithRetry(this.client, this.address, "get_cumulative_stats", [toLower(addr)]);
    const mapped = mapContractResult(raw);
    if (mapped && typeof mapped === "object") {
      const stats = mapped;
      return {
        totalScore: Number(stats.total_score || 0),
        genBalance: Number(stats.gen_balance || 0),
        reputation: Number(stats.reputation || 0),
        gamesPlayed: Number(stats.games_played || 0)
      };
    }
    return { totalScore: 0, genBalance: 0, reputation: 50, gamesPlayed: 0 };
  }
  async getTotalPlayers() {
    const raw = await readContractWithRetry(this.client, this.address, "get_total_players", []);
    return Number(mapContractResult(raw) ?? 0);
  }
  async getTotalGames() {
    const raw = await readContractWithRetry(this.client, this.address, "get_total_games", []);
    return Number(mapContractResult(raw) ?? 0);
  }
  async getTotalVotes() {
    const raw = await readContractWithRetry(this.client, this.address, "get_total_votes", []);
    return Number(mapContractResult(raw) ?? 0);
  }
  async getLeaderboard() {
    const raw = await readContractWithRetry(this.client, this.address, "get_leaderboard", []);
    const mapped = mapContractResult(raw);
    if (typeof mapped === "string") {
      try {
        return JSON.parse(mapped);
      } catch {
        return [];
      }
    }
    if (Array.isArray(mapped)) return mapped;
    return [];
  }
}
export {
  AetherisGameContract as A
};
