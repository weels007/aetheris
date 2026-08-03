import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Nav, C as ConnectWallet } from "./Nav-eTw4S0G9.mjs";
import { u as useWallet } from "./router-Bc0ZCl0V.mjs";
import { A as AetherisGameContract } from "./contract-nCXpy0JY.mjs";
import "../_libs/genlayer-js.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/viem.mjs";
import "../_libs/ox.mjs";
import "../_libs/abitype.mjs";
import "../_libs/noble__hashes.mjs";
import "node:crypto";
import "../_libs/noble__curves.mjs";
const SCENARIOS = [
  {
    id: "s1",
    category: "Prediction",
    prompt: "Resolve market: 'Will Bitcoin close above $80,000 on Dec 31, 2024?'",
    context: "Oracle feed reports BTC closed at $93,712 on Dec 31, 2024 across 4 major exchanges.",
    difficulty: 1,
    rationale: "Multiple oracle sources confirm the price exceeded the threshold."
  },
  {
    id: "s2",
    category: "AI Contract",
    prompt: "Smart contract receives tweet: 'I love $GEN to the moon'. Sentiment positive?",
    context: "Contract pays out if LLM validators classify the tweet as POSITIVE sentiment.",
    difficulty: 1,
    rationale: "Clearly positive sentiment — bullish language."
  },
  {
    id: "s3",
    category: "DeFi",
    prompt: "Liquidation request for vault #4827. Collateral ratio: 142%. Threshold: 150%.",
    context: "GenLayer LLM validators must approve liquidations below 150% CR.",
    difficulty: 2,
    rationale: "142% is below the 150% safety threshold — liquidation valid."
  },
  {
    id: "s4",
    category: "Governance",
    prompt: "Proposal #19: Increase validator stake from 1000 GEN to 1,000,000 GEN overnight.",
    context: "DAO vote: 8% YES, 91% NO, 1% abstain. Quorum reached.",
    difficulty: 1,
    rationale: "Overwhelming NO vote — proposal must be rejected."
  },
  {
    id: "s5",
    category: "Oracle",
    prompt: "Confirm weather event: 'Hurricane made landfall in Florida on Oct 9, 2024'.",
    context: "NOAA, Reuters, and AP all report Hurricane Milton landfall on Oct 9, 2024.",
    difficulty: 2,
    rationale: "Three independent trusted sources confirm."
  },
  {
    id: "s6",
    category: "AI Contract",
    prompt: "Insurance contract: User claims 'flight delayed >3hrs'. Airline API says 47 min delay.",
    context: "Pays out only if delay exceeds 3 hours per verified airline data.",
    difficulty: 1,
    rationale: "Verified delay (47 min) does not meet the 3-hour threshold."
  },
  {
    id: "s7",
    category: "Prediction",
    prompt: "Market: 'Will Team A win the championship?' — Game ended in a draw, pending replay.",
    context: "No conclusive outcome yet. Replay scheduled in 3 days.",
    difficulty: 3,
    rationale: "Outcome is undetermined — resolving now would be premature."
  },
  {
    id: "s8",
    category: "DeFi",
    prompt: "Cross-chain swap: 100 GEN to 0.0001 ETH. Market rate suggests 0.05 ETH.",
    context: "Slippage protection active. Quote is 500x off fair market.",
    difficulty: 2,
    rationale: "Massive price deviation — likely oracle attack or front-run. Reject."
  },
  {
    id: "s9",
    category: "Governance",
    prompt: "Proposal: Allocate 50,000 GEN to community education program. Vote: 72% YES.",
    context: "Treasury balance: 2.4M GEN. Quorum met. Sponsor verified.",
    difficulty: 1,
    rationale: "Healthy supermajority, treasury can afford, sponsor verified."
  },
  {
    id: "s10",
    category: "Oracle",
    prompt: "Verify news: 'GenLayer mainnet launched in 1995'. Multiple anonymous blog posts.",
    context: "No authoritative source. GenLayer was founded long after 1995.",
    difficulty: 2,
    rationale: "Claim contradicts known facts; sources are not authoritative."
  },
  {
    id: "s11",
    category: "AI Contract",
    prompt: "Contract scrapes website price for 'iPhone 16'. Site says '$999'. Contract triggers buy below $800.",
    context: "Price ($999) is above trigger ($800).",
    difficulty: 1,
    rationale: "Trigger condition not met — do not execute purchase."
  },
  {
    id: "s12",
    category: "Prediction",
    prompt: "Market: 'Will an AI write a #1 NYT bestseller by 2030?' Current date: 2026.",
    context: "Event has not occurred. Market resolution date is 2030.",
    difficulty: 3,
    rationale: "Resolution window still open — too early to settle."
  }
];
function randomScenarios(count) {
  const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
const ROUNDS = 3;
function PlayPage() {
  const {
    address,
    client
  } = useWallet();
  const [phase, setPhase] = reactExports.useState("intro");
  const [round, setRound] = reactExports.useState(0);
  const [scenarios, setScenarios] = reactExports.useState([]);
  const [userVote, setUserVote] = reactExports.useState(null);
  const [roundResult, setRoundResult] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const [streak, setStreak] = reactExports.useState(0);
  const [maxStreak, setMaxStreak] = reactExports.useState(0);
  const [gen, setGen] = reactExports.useState(0);
  const [reputation, setReputation] = reactExports.useState(0);
  const [history, setHistory] = reactExports.useState([]);
  const [log, setLog] = reactExports.useState(["[boot] validator node online", "[net]  connecting to genlayer testnet...", "[net]  consensus = optimistic democracy"]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isRegistered, setIsRegistered] = reactExports.useState(false);
  const [playerName, setPlayerName] = reactExports.useState("");
  const [isVoting, setIsVoting] = reactExports.useState(false);
  const [isEvaluating, setIsEvaluating] = reactExports.useState(false);
  const [isRegistering, setIsRegistering] = reactExports.useState(false);
  const [isStarting, setIsStarting] = reactExports.useState(false);
  const [votesCollected, setVotesCollected] = reactExports.useState([]);
  const [roundResults, setRoundResults] = reactExports.useState([]);
  const logRef = reactExports.useRef(null);
  const contractRef = reactExports.useRef(null);
  const current = scenarios[round];
  const appendLog = (msg) => setLog((l) => [...l.slice(-40), `[${(/* @__PURE__ */ new Date()).toLocaleTimeString().slice(0, 8)}] ${msg}`]);
  reactExports.useEffect(() => {
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
        try {
          const registered = await contract.isRegistered(address);
          if (registered) {
            setIsRegistered(true);
            const [genBalance, rep, stats, name] = await Promise.all([contract.getGen(address), contract.getRep(address), contract.getStats(address), contract.getPlayerName(address)]);
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
            localStorage.removeItem("aetheris_playerName");
            appendLog("[wallet] not registered on this contract");
          }
        } catch (e) {
          console.warn("[play] on-chain read failed:", e);
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
  reactExports.useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [log]);
  async function registerPlayer(name) {
    if (!contractRef.current || !address || !name.trim() || isRegistering) return;
    setIsRegistering(true);
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
    } finally {
      setIsRegistering(false);
    }
  }
  async function startGame() {
    if (!contractRef.current || !address || isStarting) return;
    setIsStarting(true);
    try {
      appendLog("[tx] starting session...");
      await contractRef.current.startSession();
      setScenarios(randomScenarios(ROUNDS));
      setRound(0);
      setStreak(0);
      setMaxStreak(0);
      setHistory([]);
      setRoundResults([]);
      setUserVote(null);
      setRoundResult(null);
      setPhase("voting");
      appendLog("[tx] session started — 3 rounds queued");
    } catch (err) {
      appendLog(`[error] start session failed: ${err}`);
    } finally {
      setIsStarting(false);
    }
  }
  async function handleVote(v) {
    if (phase !== "voting" || !current) return;
    const finalVote = v ?? (Math.random() < 0.5 ? "APPROVE" : "REJECT");
    setUserVote(finalVote);
    setIsVoting(true);
    const voteData = {
      proposal: current.prompt,
      vote: finalVote,
      context: current.context
    };
    setVotesCollected((prev) => [...prev, voteData]);
    appendLog(`[round ${round + 1}] voted ${finalVote} — submitting to GenLayer...`);
    try {
      const result = await contractRef.current?.evaluateVote(voteData);
      const isCorrect = result?.correct ?? false;
      const consensusResult = result?.result ?? "unknown";
      appendLog(`[round ${round + 1}] AI consensus: ${isCorrect ? "CORRECT" : "WRONG"}`);
      const roundResult2 = {
        correct: isCorrect,
        vote: finalVote,
        result: consensusResult
      };
      setRoundResult(roundResult2);
      setRoundResults((prev) => [...prev, roundResult2]);
      setHistory((prev) => [...prev, {
        correct: isCorrect,
        gain: 0
      }]);
      if (isCorrect) {
        setStreak((s) => {
          const newStreak = s + 1;
          setMaxStreak((prev) => Math.max(prev, newStreak));
          return newStreak;
        });
        setScore((s) => s + 100);
      } else {
        setStreak(0);
      }
    } catch (err) {
      appendLog(`[round ${round + 1}] vote failed: ${err}`);
      const failResult = {
        correct: false,
        vote: finalVote,
        result: "error"
      };
      setRoundResult(failResult);
      setRoundResults((prev) => [...prev, failResult]);
      setHistory((prev) => [...prev, {
        correct: false,
        gain: 0
      }]);
    }
    setIsVoting(false);
    setPhase("reveal");
  }
  async function nextRound() {
    if (round + 1 >= ROUNDS) {
      setPhase("evaluating");
      setIsEvaluating(true);
      try {
        appendLog("[tx] ending session — finalizing on-chain stats...");
        const sessionResult = await contractRef.current?.endSession();
        appendLog(`[ai] session complete: ${sessionResult?.correct}/${sessionResult?.total} correct`);
        const addr = address || "";
        const cumStats = await contractRef.current?.getCumulativeStats(addr);
        setScore(cumStats?.totalScore || 0);
        setGen(cumStats?.genBalance || 0);
        setReputation(cumStats?.reputation || 50);
      } catch (err) {
        appendLog(`[error] end session failed: ${err}`);
      } finally {
        setIsEvaluating(false);
        setPhase("finished");
      }
      return;
    }
    setRound((r) => r + 1);
    setUserVote(null);
    setRoundResult(null);
    setPhase("voting");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-8", children: [
      phase === "intro" && /* @__PURE__ */ jsxRuntimeExports.jsx(Intro, { onStart: startGame, onRegister: registerPlayer, isRegistered, isLoading, isRegistering, isStarting, gen, rep: reputation }),
      phase !== "intro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_320px] gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatBar, { round, total: ROUNDS, gen, rep: reputation, streak, score, phase }),
          phase === "voting" && current && /* @__PURE__ */ jsxRuntimeExports.jsx(VotingPanel, { scenario: current, onVote: handleVote, isVoting }),
          phase === "reveal" && current && roundResult && /* @__PURE__ */ jsxRuntimeExports.jsx(RevealPanel, { scenario: current, userVote, roundResult, onNext: nextRound, last: round + 1 >= ROUNDS }),
          phase === "finished" && /* @__PURE__ */ jsxRuntimeExports.jsx(Finished, { score, gen, rep: reputation, maxStreak, history, onRestart: startGame, playerName, votesCollected, roundResults, isStarting }),
          phase === "evaluating" && /* @__PURE__ */ jsxRuntimeExports.jsx(EvaluatingPanel, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidePanel, { logRef, log, history, score, playerName })
      ] })
    ] })
  ] });
}
function Intro({
  onStart,
  onRegister,
  isRegistered,
  isLoading,
  isRegistering,
  isStarting,
  gen,
  rep
}) {
  const {
    isConnected
  } = useWallet();
  const [nameInput, setNameInput] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/40 bg-card glow p-10 relative overflow-hidden scanlines", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-4", children: "// mission_briefing" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-bold tracking-tight", children: [
      "Welcome, ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "validator" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4 text-muted-foreground leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "You've just spun up a node on the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "GenLayer" }),
        " ",
        "testnet. Over the next 3 rounds, transaction proposals will arrive in your mempool — each one requiring",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: " human-or-AI judgement" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Your job: read the prompt, evaluate the context, and vote",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-success", children: "APPROVE" }),
        " or",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-destructive", children: "REJECT" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "If you match the leader validator (Optimistic Democracy), you earn",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-primary", children: "GEN" }),
        " tokens and reputation. Otherwise, you get slashed."
      ] })
    ] }),
    isConnected && isRegistered && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-4 text-center", children: [{
      v: String(gen),
      l: "Your GEN"
    }, {
      v: `${rep}%`,
      l: "Reputation"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background/40 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-bold text-gradient", children: s.v }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mt-1", children: s.l })
    ] }, s.l)) }),
    !isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-warning/50 bg-warning/10 p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm text-warning", children: "Connect your wallet to start playing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: "You need MetaMask connected to GenLayer testnet to participate" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectWallet, {}) })
    ] }) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm text-muted-foreground", children: "Loading player data..." }) }) : !isRegistered ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-accent/50 bg-accent/10 p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm text-accent", children: "Register to start playing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: "Create your validator node on GenLayer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: nameInput, onChange: (e) => setNameInput(e.target.value), placeholder: "Enter your validator name", maxLength: 20, className: "w-full rounded-md border border-border bg-background/40 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onRegister(nameInput), disabled: !nameInput.trim() || isRegistering, className: "w-full rounded-md bg-gradient-to-r from-primary to-accent py-4 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed", children: isRegistering ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin size-4", viewBox: "0 0 24 24", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
        ] }),
        "Registering..."
      ] }) : "Register Node" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onStart, disabled: isStarting, className: "mt-8 w-full rounded-md bg-gradient-to-r from-primary to-accent py-4 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed", children: isStarting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin size-4", viewBox: "0 0 24 24", fill: "none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ] }),
      "Starting..."
    ] }) : "Initialize Node" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground", children: "← back to home" }) })
  ] }) });
}
function StatBar({
  round,
  total,
  gen,
  rep,
  streak,
  score,
  phase
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card/80 backdrop-blur p-4 grid grid-cols-2 md:grid-cols-5 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Round", value: `${Math.min(round + 1, total)}/${total}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Score", value: String(score) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "GEN", value: String(gen), accent: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Rep", value: `${rep}%`, bar: rep }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Streak", value: `${streak}` })
  ] });
}
function Stat({
  label,
  value,
  accent,
  bar,
  danger
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-mono text-xl font-bold ${accent ? "text-gradient" : danger ? "text-destructive animate-pulse" : "text-foreground"}`, children: value }),
    typeof bar === "number" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-primary to-accent", style: {
      width: `${bar}%`
    } }) })
  ] });
}
function VotingPanel({
  scenario,
  onVote,
  isVoting
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-primary/40 bg-card relative overflow-hidden scanlines", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-widest px-2 py-1 rounded border border-accent/50 text-accent bg-accent/10", children: scenario.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: [
        "difficulty · ",
        "●".repeat(scenario.difficulty),
        "○".repeat(3 - scenario.difficulty)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "# proposal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold leading-tight", children: scenario.prompt }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-md border border-border bg-background/40 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-2", children: "// context" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: scenario.context })
    ] }),
    isVoting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-md border border-primary/50 bg-primary/10 p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm text-primary animate-pulse", children: "Sending to GenLayer network..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: "MetaMask will prompt you to sign the transaction" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onVote("APPROVE"), className: "group rounded-lg border-2 border-success/60 bg-success/10 hover:bg-success/20 hover:glow py-6 font-mono uppercase tracking-widest text-success transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "✓" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm", children: "APPROVE" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onVote("REJECT"), className: "group rounded-lg border-2 border-destructive/60 bg-destructive/10 hover:bg-destructive/20 hover:glow-magenta py-6 font-mono uppercase tracking-widest text-destructive transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "✗" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm", children: "REJECT" })
      ] })
    ] })
  ] }) });
}
function RevealPanel({
  scenario,
  userVote,
  roundResult,
  onNext,
  last
}) {
  const correct = roundResult.correct;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border-2 ${correct ? "border-success/60" : "border-destructive/60"} bg-card overflow-hidden`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-8 py-4 ${correct ? "bg-success/15" : "bg-destructive/15"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest opacity-70", children: "consensus reached" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-3xl font-bold font-mono ${correct ? "text-success" : "text-destructive"}`, children: correct ? "YOU MATCHED THE NETWORK" : "DIVERGED FROM CONSENSUS" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background/40 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "# your vote" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-mono text-lg font-bold ${userVote === "APPROVE" ? "text-success" : "text-destructive"}`, children: userVote }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-muted-foreground", children: [
            "AI consensus: ",
            roundResult.result
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-primary/30 bg-primary/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-2", children: "// rationale" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: scenario.rationale })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onNext, className: "w-full rounded-md bg-gradient-to-r from-primary to-accent py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.01] transition", children: last ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "size-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }) }),
        "Finalize Session"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
        "Next Proposal",
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "size-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) })
      ] }) })
    ] })
  ] });
}
function EvaluatingPanel() {
  const [elapsed, setElapsed] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1e3);
    return () => clearInterval(timer);
  }, []);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const pct = Math.min(elapsed / 120 * 100, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-primary/60 bg-card overflow-hidden glow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-6 bg-primary/10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-3", children: "// finalizing_session" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-primary animate-pulse", children: "Finalizing On-Chain Stats" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Updating leaderboard and reputation on GenLayer." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3 rounded-full bg-primary animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-3 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center font-mono text-2xl font-bold text-foreground", children: [
        String(mins).padStart(2, "0"),
        ":",
        String(secs).padStart(2, "0")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-secondary rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all duration-1000 rounded-full", style: {
        width: `${pct}%`
      } }) })
    ] })
  ] });
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
  roundResults,
  isStarting
}) {
  const correct = history.filter((h) => h.correct).length;
  const total = history.length;
  const acc = total > 0 ? Math.round(correct / total * 100) : 0;
  const rank = reactExports.useMemo(() => {
    if (acc >= 90) return {
      t: "GENESIS VALIDATOR",
      c: "text-gradient",
      icon: "◆"
    };
    if (acc >= 75) return {
      t: "TRUSTED NODE",
      c: "text-success",
      icon: "◇"
    };
    if (acc >= 50) return {
      t: "PROBATIONARY",
      c: "text-warning",
      icon: "○"
    };
    return {
      t: "SLASHED",
      c: "text-destructive",
      icon: "✕"
    };
  }, [acc]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/40 bg-card glow p-10 relative scanlines", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-3", children: "// ai_consensus_final_report" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "Session Complete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-4 font-mono text-2xl font-bold ${rank.c}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: rank.icon }),
        rank.t
      ] }),
      playerName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 font-mono text-sm text-muted-foreground", children: [
        "Validator: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: playerName })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "Accuracy", value: `${acc}%` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "Score", value: String(score) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "GEN", value: String(gen) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "Correct", value: `${correct}/${total}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-md border border-border bg-background/40 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "// vote_summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 justify-center", children: roundResults.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-8 rounded font-mono text-xs grid place-items-center border ${r.correct ? "bg-success/20 text-success border-success/50" : "bg-destructive/20 text-destructive border-destructive/50"}`, children: r.vote === "APPROVE" ? "✓" : "✗" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
          "R",
          i + 1
        ] })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex gap-3 justify-center flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onRestart, disabled: isStarting, className: "rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed", children: isStarting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin size-4", viewBox: "0 0 24 24", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
        ] }),
        "Starting..."
      ] }) : "Play Again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-md border border-border px-6 py-3 font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition", children: "← Home" })
    ] })
  ] });
}
function ResultStat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background/40 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-3xl font-bold text-gradient", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mt-1", children: label })
  ] });
}
function LeaderboardLink() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-b border-border bg-secondary/40 font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "size-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 15l-2 5l9-13h-6l2-5-9 13h6z" }) }),
      "leaderboard"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/leaderboard", className: "inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition", children: [
      "View Global Leaderboard",
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "size-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) })
    ] }) })
  ] });
}
function SidePanel({
  logRef,
  log,
  history,
  score,
  playerName
}) {
  history.length > 0 ? Math.round(history.filter((h) => h.correct).length / history.length * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4 lg:sticky lg:top-24 lg:self-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 border-b border-border bg-secondary/40 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "// node_log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: logRef, className: "p-3 h-64 overflow-y-auto font-mono text-[11px] leading-relaxed text-muted-foreground space-y-1", children: log.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap", children: l }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "// round_history" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: Array.from({
        length: ROUNDS
      }).map((_, i) => {
        const h = history[i];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-7 rounded font-mono text-xs grid place-items-center ${!h ? "border border-border text-muted-foreground" : h.correct ? "bg-success/20 text-success border border-success/50" : "bg-destructive/20 text-destructive border border-destructive/50"}`, children: i + 1 }, i);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardLink, {})
  ] });
}
export {
  PlayPage as component
};
