import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Nav, C as ConnectWallet } from "./Nav-eTw4S0G9.mjs";
import { u as useWallet } from "./router-Bc0ZCl0V.mjs";
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
const FEATURES = [{
  tag: "AI Validators",
  title: "LLMs as Consensus",
  desc: "GenLayer uses Large Language Models as decentralized validators that interpret natural language and reach consensus on subjective outcomes."
}, {
  tag: "Optimistic Democracy",
  title: "Probabilistic Truth",
  desc: "Instead of one deterministic answer, validators converge through majority voting — solving disputes that traditional blockchains can't."
}, {
  tag: "Intelligent Contracts",
  title: "Beyond Smart Contracts",
  desc: "Contracts can call the web, parse tweets, evaluate sentiment, resolve prediction markets, and run actual reasoning on-chain."
}, {
  tag: "Web Access",
  title: "Native Internet I/O",
  desc: "Validators can fetch live data from the open web — no oracle middleman required for most use cases."
}];
const HOW_IT_WORKS = [{
  n: "01",
  t: "Receive Proposal",
  d: "A transaction request lands in the mempool with natural-language context."
}, {
  n: "02",
  t: "Read the Context",
  d: "As a validator, evaluate evidence, oracle feeds, and the prompt."
}, {
  n: "03",
  t: "Vote APPROVE / REJECT",
  d: "Cast your vote before the timer expires."
}, {
  n: "04",
  t: "Reach Consensus",
  d: "If you match the majority of AI validators, you earn GEN and reputation."
}];
function Landing() {
  const {
    isConnected
  } = useWallet();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-6 py-24 md:py-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-primary animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-widest text-primary", children: "Mainnet sim · v1.0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight", children: [
            "Become an ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "AI validator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "on the intelligent chain."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: "Aetheris // Quorum" }),
            " is an interactive simulator of ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "GenLayer" }),
            " — the blockchain where LLMs reach Optimistic Democracy on subjective truths. Vote on proposals, match the network majority, and climb the validator ladder."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-4", children: [
            isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play", className: "group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-sm text-primary-foreground glow hover:scale-[1.02] transition", children: "▶ Convene the Quorum" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectWallet, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: "Connect wallet to start playing" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#how", className: "inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-mono uppercase tracking-widest text-sm text-muted-foreground hover:text-foreground hover:border-primary transition", children: "How it works ↓" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid grid-cols-3 gap-6 max-w-lg", children: [{
            v: "12+",
            l: "Scenarios"
          }, {
            v: "5",
            l: "Categories"
          }, {
            v: "∞",
            l: "Replayability"
          }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-2 border-primary/60 pl-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-3xl font-bold text-gradient", children: s.v }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mt-1", children: s.l })
          ] }, s.l)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block absolute right-6 top-24 w-[420px] animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/40 bg-card/90 backdrop-blur-xl glow overflow-hidden relative scanlines", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-destructive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-warning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto font-mono text-xs text-muted-foreground", children: "validator.node" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-5 font-mono text-xs leading-relaxed text-muted-foreground", children: `> connecting to genlayer...
> validator stake: 1,000 GEN
> consensus mode: optimistic
> awaiting proposal...

[PROPOSAL #04827]
category: PREDICTION
prompt:  "Will BTC > $80k Dec 31?"
oracle:  $93,712 (4 sources)

[YOUR VOTE] _` })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-12 flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-2", children: "# genlayer_primitives" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-bold tracking-tight", children: "Built on real GenLayer features." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm", children: "Every game mechanic mirrors how the actual protocol works under the hood." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden", children: FEATURES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card p-8 hover:bg-secondary/40 transition group relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-accent mb-3", children: f.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-3 group-hover:text-gradient transition", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: f.desc })
      ] }, f.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "how", className: "border-t border-border/60 bg-secondary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-primary mb-2", children: "// gameplay_loop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-bold", children: "Four steps to consensus." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-4 gap-6", children: HOW_IT_WORKS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-6 h-full hover:border-primary transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-5xl font-bold text-gradient", children: s.n }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-xl font-bold", children: s.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: s.d })
        ] }),
        i < HOW_IT_WORKS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block absolute top-1/2 -right-3 text-primary text-2xl font-mono", children: "→" })
      ] }, s.n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-6xl font-bold tracking-tight", children: [
        "Ready to validate the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "future" }),
        "?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground max-w-xl mx-auto", children: "Connect your MetaMask wallet to the GenLayer testnet and start reaching consensus." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-col items-center gap-4", children: isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play", className: "inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-8 py-4 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition", children: "▶ Enter the Quorum" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectWallet, {}) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono", children: "// not affiliated with GenLayer Foundation — fan-made educational game" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Aetheris // Quorum"
      ] })
    ] }) })
  ] });
}
export {
  Landing as component
};
