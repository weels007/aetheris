import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useWallet } from "@/lib/genlayer/wallet";
import { AetherisGameContract, type VoteData } from "@/lib/genlayer/contract";
import { randomScenarios, type Scenario } from "@/game/scenarios";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play · Aetheris // Quorum" },
      {
        name: "description",
        content:
          "Play as a GenLayer AI validator. Reach Optimistic Democracy consensus and earn GEN.",
      },
    ],
  }),
  component: PlayPage,
});

const ROUNDS = 3;

type Phase = "intro" | "voting" | "reveal" | "evaluating" | "finished";
type Vote = "APPROVE" | "REJECT";

interface ValidatorAgent {
  name: string;
  model: string;
  vote: Vote;
  confidence: number;
}

function pickValidators(truth: Vote): ValidatorAgent[] {
  return [
    {
      name: "Leader-Validator",
      model: "gpt-4o",
      vote: truth,
      confidence: Math.round(85 + Math.random() * 14),
    },
  ];
}

function PlayPage() {
  const { address, client } = useWallet();
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [validators, setValidators] = useState<ValidatorAgent[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gen, setGen] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [history, setHistory] = useState<{ correct: boolean; gain: number }[]>([]);
  const [log, setLog] = useState<string[]>([
    "[boot] validator node online",
    "[net]  connecting to genlayer testnet...",
    "[net]  consensus = optimistic democracy",
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [votesCollected, setVotesCollected] = useState<VoteData[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const contractRef = useRef<AetherisGameContract | null>(null);

  const current = scenarios[round];

  const appendLog = (msg: string) =>
    setLog((l) => [...l.slice(-40), `[${new Date().toLocaleTimeString().slice(0, 8)}] ${msg}`]);

  // Initialize contract and fetch player data
  useEffect(() => {
    if (!client || !address) {
      setIsLoading(false);
      return;
    }

    contractRef.current = new AetherisGameContract(client);

    const fetchPlayerData = async () => {
      try {
        const contract = contractRef.current;
        if (!contract) return;

        appendLog(`[wallet] connected: ${address.slice(0, 6)}...${address.slice(-4)}`);

        // Always check on-chain first — localStorage may be stale from old contract
        try {
          const registered = await contract.isRegistered(address);
          if (registered) {
            setIsRegistered(true);
            const [genBalance, rep, stats, name] = await Promise.all([
              contract.getGen(address),
              contract.getRep(address),
              contract.getStats(address),
              contract.getPlayerName(address),
            ]);

            setGen(Number(genBalance));
            setReputation(Number(rep));
            if (name) {
              setPlayerName(name);
              localStorage.setItem("aetheris_playerName", name);
            }

            const scoreMatch = stats.match(/score:(\d+)/);
            if (scoreMatch) {
              setScore(Number(scoreMatch[1]));
            }

            appendLog(`[player] ${name} | GEN: ${genBalance} | REP: ${rep}`);
          } else {
            // Not registered on-chain — clear stale localStorage
            localStorage.removeItem("aetheris_playerName");
            appendLog("[wallet] not registered on this contract");
          }
        } catch (e) {
          console.warn("[play] on-chain read failed:", e);
          // Fallback to localStorage if on-chain fails
          const cachedName = localStorage.getItem("aetheris_playerName");
          if (cachedName) {
            setIsRegistered(true);
            setPlayerName(cachedName);
            appendLog(`[player] ${cachedName} (cached)`);
          } else {
            appendLog("[wallet] contract read failed");
          }
        }
      } catch (err) {
        appendLog(`[error] failed to fetch player data: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, [client, address]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  async function registerPlayer(name: string) {
    if (!contractRef.current || !address || !name.trim()) return;

    try {
      appendLog("[tx] registering player...");
      await contractRef.current.register(name.trim());
      localStorage.setItem("aetheris_playerName", name.trim());
      setIsRegistered(true);
      setPlayerName(name.trim());
      setGen(1);
      setReputation(50);
      appendLog(`[tx] registered as "${name.trim()}"`);
    } catch (err) {
      appendLog(`[error] registration failed: ${err}`);
    }
  }

  async function startGame() {
    if (!contractRef.current || !address) return;

    try {
      appendLog("[tx] starting session...");
      await contractRef.current.startSession();

      setScenarios(randomScenarios(ROUNDS));
      setRound(0);
      setStreak(0);
      setMaxStreak(0);
      setHistory([]);
      setUserVote(null);
      setPhase("voting");
      appendLog("[tx] session started — 8 rounds queued");
    } catch (err) {
      appendLog(`[error] start session failed: ${err}`);
    }
  }

  async function handleVote(v: Vote | null) {
    console.log("[handleVote] called", {
      phase,
      hasContract: !!contractRef.current,
      hasCurrent: !!current,
      round,
    });
    if (phase !== "voting" || !current) return;

    const finalVote: Vote = v ?? (Math.random() < 0.5 ? "APPROVE" : "REJECT");
    setUserVote(v);
    setIsVoting(true);

    const voteData: VoteData = {
      proposal: current.prompt,
      vote: finalVote,
      context: current.context,
      difficulty: current.difficulty,
    };
    setVotesCollected((prev) => [...prev, voteData]);

    const truth = current.truth;
    setValidators([
      {
        name: "Leader-Validator",
        model: "gpt-4o",
        vote: truth,
        confidence: Math.round(85 + Math.random() * 14),
      },
    ]);

    appendLog(`[round ${round + 1}] voted ${finalVote} (local)`);

    setIsVoting(false);
    setPhase("reveal");
  }

  async function nextRound() {
    if (round + 1 >= ROUNDS) {
      setPhase("evaluating");
      setIsEvaluating(true);

      try {
        appendLog("[tx] submitting votes to GenLayer AI consensus...");
        const result = await contractRef.current?.evaluateSession(votesCollected);
        appendLog(`[ai] consensus complete: ${result?.correct}/${result?.total} correct`);

        setScore(result?.score || 0);
        setGen((g) => g + (result?.gen || 0));

        const correctCount = result?.correct || 0;
        setReputation((r) => Math.max(0, Math.min(100, r + correctCount * 4)));
        setHistory(votesCollected.map((_, i) => ({ correct: i < correctCount, gain: 0 })));
      } catch (err) {
        appendLog(`[error] AI consensus failed: ${err}`);
      } finally {
        setIsEvaluating(false);
        setPhase("finished");
      }
      return;
    }
    setRound((r) => r + 1);
    setUserVote(null);
    setValidators([]);
    setPhase("voting");
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="mx-auto max-w-7xl px-6 py-8">
        {phase === "intro" && (
          <Intro
            onStart={startGame}
            onRegister={registerPlayer}
            isRegistered={isRegistered}
            isLoading={isLoading}
            gen={gen}
            rep={reputation}
          />
        )}
        {phase !== "intro" && (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <StatBar
                round={round}
                total={ROUNDS}
                gen={gen}
                rep={reputation}
                streak={streak}
                score={score}
                phase={phase}
              />
              {phase === "voting" && current && (
                <VotingPanel scenario={current} onVote={handleVote} isVoting={isVoting} />
              )}
              {phase === "reveal" && current && (
                <RevealPanel
                  scenario={current}
                  userVote={userVote}
                  validators={validators}
                  onNext={nextRound}
                  last={round + 1 >= ROUNDS}
                />
              )}
              {phase === "finished" && (
                <Finished
                  score={score}
                  gen={gen}
                  rep={reputation}
                  maxStreak={maxStreak}
                  history={history}
                  onRestart={startGame}
                  playerName={playerName}
                  votesCollected={votesCollected}
                />
              )}
              {phase === "evaluating" && <EvaluatingPanel />}
            </div>
            <SidePanel
              logRef={logRef}
              log={log}
              history={history}
              score={score}
              playerName={playerName}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Intro({
  onStart,
  onRegister,
  isRegistered,
  isLoading,
  gen,
  rep,
}: {
  onStart: () => void;
  onRegister: (name: string) => void;
  isRegistered: boolean;
  isLoading: boolean;
  gen: number;
  rep: number;
}) {
  const { isConnected } = useWallet();
  const [nameInput, setNameInput] = useState("");

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="rounded-xl border border-primary/40 bg-card glow p-10 relative overflow-hidden scanlines">
        <div className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          // mission_briefing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome, <span className="text-gradient">validator</span>.
        </h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            You've just spun up a node on the <strong className="text-foreground">GenLayer</strong>{" "}
            testnet. Over the next 3 rounds, transaction proposals will arrive in your mempool —
            each one requiring
            <strong className="text-foreground"> human-or-AI judgement</strong>.
          </p>
          <p>
            Your job: read the prompt, evaluate the context, and vote{" "}
            <span className="font-mono text-success">APPROVE</span> or{" "}
            <span className="font-mono text-destructive">REJECT</span>.
          </p>
          <p>
            If you match the leader validator (Optimistic Democracy), you earn{" "}
            <span className="font-mono text-primary">GEN</span> tokens and reputation. Otherwise,
            you get slashed.
          </p>
        </div>

        {isConnected && isRegistered && (
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            {[
              { v: String(gen), l: "Your GEN" },
              { v: `${rep}%`, l: "Reputation" },
            ].map((s) => (
              <div key={s.l} className="rounded-md border border-border bg-background/40 py-3">
                <div className="font-mono text-2xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isConnected ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-md border border-warning/50 bg-warning/10 p-4 text-center">
              <div className="font-mono text-sm text-warning">
                Connect your wallet to start playing
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                You need MetaMask connected to GenLayer testnet to participate
              </div>
            </div>
            <div className="flex justify-center">
              <ConnectWallet />
            </div>
          </div>
        ) : isLoading ? (
          <div className="mt-8 text-center">
            <div className="font-mono text-sm text-muted-foreground">Loading player data...</div>
          </div>
        ) : !isRegistered ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-md border border-accent/50 bg-accent/10 p-4 text-center">
              <div className="font-mono text-sm text-accent">Register to start playing</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Create your validator node on GenLayer
              </div>
            </div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your validator name"
              maxLength={20}
              className="w-full rounded-md border border-border bg-background/40 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => onRegister(nameInput)}
              disabled={!nameInput.trim()}
              className="w-full rounded-md bg-gradient-to-r from-primary to-accent py-4 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register Node
            </button>
          </div>
        ) : (
          <button
            onClick={onStart}
            className="mt-8 w-full rounded-md bg-gradient-to-r from-primary to-accent py-4 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.01] transition"
          >
            Initialize Node
          </button>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            &#8592; back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatBar({
  round,
  total,
  gen,
  rep,
  streak,
  score,
  phase,
}: {
  round: number;
  total: number;
  gen: number;
  rep: number;
  streak: number;
  score: number;
  phase: Phase;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/80 backdrop-blur p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
      <Stat label="Round" value={`${Math.min(round + 1, total)}/${total}`} />
      <Stat label="Score" value={String(score)} />
      <Stat label="GEN" value={String(gen)} accent />
      <Stat label="Rep" value={`${rep}%`} bar={rep} />
      <Stat label="Streak" value={`${streak}`} />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  bar,
  danger,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bar?: number;
  danger?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={`font-mono text-xl font-bold ${accent ? "text-gradient" : danger ? "text-destructive animate-pulse" : "text-foreground"}`}
      >
        {value}
      </div>
      {typeof bar === "number" && (
        <div className="mt-1 h-1 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${bar}%` }}
          />
        </div>
      )}
    </div>
  );
}

function VotingPanel({
  scenario,
  onVote,
  isVoting,
}: {
  scenario: Scenario;
  onVote: (v: Vote) => void;
  isVoting: boolean;
}) {
  return (
    <div className="rounded-xl border border-primary/40 bg-card relative overflow-hidden scanlines">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs uppercase tracking-widest px-2 py-1 rounded border border-accent/50 text-accent bg-accent/10">
            {scenario.category}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            difficulty · {"●".repeat(scenario.difficulty)}
            {"○".repeat(3 - scenario.difficulty)}
          </span>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          # proposal
        </div>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">{scenario.prompt}</h2>
        <div className="mt-6 rounded-md border border-border bg-background/40 p-4">
          <div className="font-mono text-xs uppercase tracking-widest text-primary mb-2">
            // context
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{scenario.context}</p>
        </div>

        {isVoting ? (
          <div className="mt-8 rounded-md border border-primary/50 bg-primary/10 p-6 text-center">
            <div className="font-mono text-sm text-primary animate-pulse">
              Sending to GenLayer network...
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              MetaMask will prompt you to sign the transaction
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() => onVote("APPROVE")}
              className="group rounded-lg border-2 border-success/60 bg-success/10 hover:bg-success/20 hover:glow py-6 font-mono uppercase tracking-widest text-success transition"
            >
              <div className="text-3xl">✓</div>
              <div className="mt-1 text-sm">APPROVE</div>
            </button>
            <button
              onClick={() => onVote("REJECT")}
              className="group rounded-lg border-2 border-destructive/60 bg-destructive/10 hover:bg-destructive/20 hover:glow-magenta py-6 font-mono uppercase tracking-widest text-destructive transition"
            >
              <div className="text-3xl">✗</div>
              <div className="mt-1 text-sm">REJECT</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RevealPanel({
  scenario,
  userVote,
  validators,
  onNext,
  last,
}: {
  scenario: Scenario;
  userVote: Vote | null;
  validators: ValidatorAgent[];
  onNext: () => void;
  last: boolean;
}) {
  const approve =
    validators.filter((v) => v.vote === "APPROVE").length + (userVote === "APPROVE" ? 1 : 0);
  const total = validators.length + 1;
  const majority: Vote = approve > total / 2 ? "APPROVE" : "REJECT";
  const correct = userVote === majority;

  return (
    <div
      className={`rounded-xl border-2 ${correct ? "border-success/60" : "border-destructive/60"} bg-card overflow-hidden`}
    >
      <div className={`px-8 py-4 ${correct ? "bg-success/15" : "bg-destructive/15"}`}>
        <div className="font-mono text-xs uppercase tracking-widest opacity-70">
          consensus reached
        </div>
        <div
          className={`text-3xl font-bold font-mono ${correct ? "text-success" : "text-destructive"}`}
        >
          {correct
            ? "YOU MATCHED THE NETWORK"
            : userVote
              ? "DIVERGED FROM MAJORITY"
              : "TIMEOUT — VOTE DEFAULTED"}
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
            # validator votes
          </div>
          <div className="space-y-2">
            {validators.map((v) => (
              <div
                key={v.name}
                className="flex items-center gap-3 rounded-md border border-border bg-background/40 p-3"
              >
                <div className="size-8 rounded bg-gradient-to-br from-primary/40 to-accent/40 grid place-items-center font-mono text-xs">
                  {v.model.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-sm">{v.name}</div>
                  <div className="text-xs text-muted-foreground">confidence {v.confidence}%</div>
                </div>
                <span
                  className={`font-mono text-xs px-2 py-1 rounded ${v.vote === "APPROVE" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}
                >
                  {v.vote}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-md border-2 border-primary/60 bg-primary/10 p-3">
              <div className="size-8 rounded bg-gradient-to-br from-primary to-accent grid place-items-center font-mono text-xs font-bold text-primary-foreground">
                YOU
              </div>
              <div className="flex-1">
                <div className="font-mono text-sm">Your Node</div>
                <div className="text-xs text-muted-foreground">human validator</div>
              </div>
              <span
                className={`font-mono text-xs px-2 py-1 rounded ${userVote === "APPROVE" ? "bg-success/20 text-success" : userVote === "REJECT" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}
              >
                {userVote ?? "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
          <div className="font-mono text-xs uppercase tracking-widest text-primary mb-2">
            // rationale
          </div>
          <p className="text-sm leading-relaxed">{scenario.rationale}</p>
        </div>

        <button
          onClick={onNext}
          className="w-full rounded-md bg-gradient-to-r from-primary to-accent py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.01] transition"
        >
          {last ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Submit to AI Consensus
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Next Proposal
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function EvaluatingPanel() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const pct = Math.min((elapsed / 300) * 100, 100);

  return (
    <div className="rounded-xl border-2 border-primary/60 bg-card overflow-hidden glow">
      <div className="px-8 py-6 bg-primary/10 text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
          // ai_consensus_in_progress
        </div>
        <div className="text-3xl font-bold text-primary animate-pulse">
          GenLayer Validators Evaluating
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          AI consensus via prompt_comparative. Max ~5 minutes.
        </p>
      </div>
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="size-3 rounded-full bg-primary animate-pulse" />
          <div className="size-3 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
          <div className="size-3 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
        </div>
        <div className="text-center font-mono text-2xl font-bold text-foreground">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-center font-mono text-xs text-muted-foreground">
          Leader + Validator nodes running gl.eq_principle.prompt_comparative()...
        </div>
      </div>
    </div>
  );
}

function Finished({
  score,
  gen,
  rep,
  maxStreak,
  history,
  onRestart,
  playerName,
  votesCollected,
}: {
  score: number;
  gen: number;
  rep: number;
  maxStreak: number;
  history: { correct: boolean }[];
  onRestart: () => void;
  playerName: string;
  votesCollected: { vote: string; difficulty: number }[];
}) {
  const correct = history.filter((h) => h.correct).length;
  const total = history.length;
  const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
  const rank = useMemo(() => {
    if (acc >= 90) return { t: "GENESIS VALIDATOR", c: "text-gradient", icon: "◆" };
    if (acc >= 75) return { t: "TRUSTED NODE", c: "text-success", icon: "◇" };
    if (acc >= 50) return { t: "PROBATIONARY", c: "text-warning", icon: "○" };
    return { t: "SLASHED", c: "text-destructive", icon: "✕" };
  }, [acc]);

  const trophies = useMemo(() => {
    const items: { label: string; color: string }[] = [];
    if (acc === 100) items.push({ label: "FLAWLESS", color: "text-gradient" });
    if (maxStreak >= 3) items.push({ label: `${maxStreak}x STREAK`, color: "text-success" });
    if (votesCollected.every((v) => v.difficulty >= 3))
      items.push({ label: "HARD MODE", color: "text-accent" });
    return items;
  }, [acc, maxStreak, votesCollected]);

  return (
    <div className="rounded-xl border border-primary/40 bg-card glow p-10 relative scanlines">
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
          // ai_consensus_final_report
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">Session Complete</h2>
        <div className={`mt-4 font-mono text-2xl font-bold ${rank.c}`}>
          <span className="mr-2">{rank.icon}</span>
          {rank.t}
        </div>
        {playerName && (
          <div className="mt-2 font-mono text-sm text-muted-foreground">
            Validator: <span className="text-foreground">{playerName}</span>
          </div>
        )}
      </div>

      {trophies.length > 0 && (
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          {trophies.map((t) => (
            <span
              key={t.label}
              className={`font-mono text-xs px-3 py-1 rounded-full border border-current/30 ${t.color}`}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <ResultStat label="Accuracy" value={`${acc}%`} />
        <ResultStat label="Score" value={String(score)} />
        <ResultStat label="GEN" value={String(gen)} />
        <ResultStat label="Best Streak" value={`${maxStreak}`} />
      </div>

      <div className="mt-6 rounded-md border border-border bg-background/40 p-4">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          // vote_summary
        </div>
        <div className="flex gap-2 justify-center">
          {votesCollected.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`size-8 rounded font-mono text-xs grid place-items-center border ${
                  history[i]?.correct
                    ? "bg-success/20 text-success border-success/50"
                    : "bg-destructive/20 text-destructive border-destructive/50"
                }`}
              >
                {v.vote === "APPROVE" ? "✓" : "✗"}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">R{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3 justify-center flex-wrap">
        <button
          onClick={onRestart}
          className="rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition"
        >
          Play Again
        </button>
        <Link
          to="/"
          className="rounded-md border border-border px-6 py-3 font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 py-4">
      <div className="font-mono text-3xl font-bold text-gradient">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function LeaderboardLink() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border bg-secondary/40 font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 15l-2 5l9-13h-6l2-5-9 13h6z" />
        </svg>
        leaderboard
      </div>
      <div className="p-4 text-center">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition"
        >
          View Global Leaderboard
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function SidePanel({
  logRef,
  log,
  history,
  score,
  playerName,
}: {
  logRef: React.RefObject<HTMLDivElement | null>;
  log: string[];
  history: { correct: boolean }[];
  score: number;
  playerName: string;
}) {
  const accuracy =
    history.length > 0
      ? Math.round((history.filter((h) => h.correct).length / history.length) * 100)
      : 0;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-secondary/40 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          // node_log
        </div>
        <div
          ref={logRef}
          className="p-3 h-64 overflow-y-auto font-mono text-[11px] leading-relaxed text-muted-foreground space-y-1"
        >
          {log.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {l}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          // round_history
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: ROUNDS }).map((_, i) => {
            const h = history[i];
            return (
              <div
                key={i}
                className={`size-7 rounded font-mono text-xs grid place-items-center ${
                  !h
                    ? "border border-border text-muted-foreground"
                    : h.correct
                      ? "bg-success/20 text-success border border-success/50"
                      : "bg-destructive/20 text-destructive border border-destructive/50"
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
      <LeaderboardLink />
    </aside>
  );
}
