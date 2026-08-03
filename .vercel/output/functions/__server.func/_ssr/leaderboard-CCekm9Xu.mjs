import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Nav } from "./Nav-eTw4S0G9.mjs";
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
function LeaderboardPage() {
  const {
    client
  } = useWallet();
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }
    const fetchLeaderboard = async () => {
      try {
        const contract = new AetherisGameContract(client);
        const data = await contract.getLeaderboard();
        setEntries(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [client]);
  const medals = ["◆", "◇", "○"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/40 bg-card glow p-10 relative overflow-hidden scanlines", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-4", children: "// global_leaderboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-bold tracking-tight mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Leaderboard" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Top validators ranked by AI consensus score on GenLayer" }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: "Loading leaderboard..." })
      ] }) }) : entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "◇" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-lg text-muted-foreground", children: "No entries yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Be the first validator to complete a session!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play", className: "mt-6 inline-block rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition", children: "Start Playing" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Validator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right w-16", children: "Accuracy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: entries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 items-center transition ${i < 3 ? "bg-primary/5" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-12 font-mono text-lg font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`, children: medals[i] || `${i + 1}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm font-medium", children: entry.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: entry.address })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-lg font-bold text-primary", children: entry.score }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-mono text-sm text-right w-16 ${entry.accuracy >= 90 ? "text-success" : entry.accuracy >= 50 ? "text-warning" : "text-destructive"}`, children: [
            entry.accuracy,
            "%"
          ] })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play", className: "rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition", children: "Play Now" }) })
    ] }) })
  ] });
}
export {
  LeaderboardPage as component
};
