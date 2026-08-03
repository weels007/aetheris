import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useWallet } from "./router-Bc0ZCl0V.mjs";
function ConnectWallet() {
  const { address, isConnected, isConnecting, connect, disconnect, error } = useWallet();
  if (isConnected && address) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-success animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
          address.slice(0, 6),
          "...",
          address.slice(-4)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: disconnect,
          className: "rounded-md border border-border bg-card/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition",
          children: "Disconnect"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: connect,
        disabled: isConnecting,
        className: "flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed",
        children: isConnecting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
          "Connecting..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "size-4",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 12V7H5a2 2 0 010-4h14v4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 5v14a2 2 0 002 2h16v-5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 12a2 2 0 000 4h4v-4h-4z" })
              ]
            }
          ),
          "Connect Wallet"
        ] })
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-destructive", children: error })
  ] });
}
function Nav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-4 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-sm bg-gradient-to-br from-primary to-accent grid place-items-center font-display text-primary-foreground font-bold italic animate-pulse-glow", children: "Æ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display italic text-lg text-foreground", children: "Aetheris" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground", children: "// quorum · genlayer sim" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-1 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/",
            activeOptions: { exact: true },
            activeProps: { className: "text-foreground bg-secondary" },
            inactiveProps: { className: "text-muted-foreground" },
            className: "px-3 py-1.5 rounded-sm hover:text-foreground transition font-mono text-xs uppercase tracking-widest",
            children: "Index"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/play",
            activeProps: { className: "text-primary-foreground bg-primary glow" },
            inactiveProps: { className: "text-muted-foreground border border-border" },
            className: "px-4 py-1.5 rounded-sm hover:text-foreground transition font-mono uppercase tracking-[0.25em] text-xs",
            children: "▸ Enter Quorum"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/leaderboard",
            activeProps: { className: "text-foreground bg-secondary" },
            inactiveProps: { className: "text-muted-foreground" },
            className: "px-3 py-1.5 rounded-sm hover:text-foreground transition font-mono text-xs uppercase tracking-widest flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "size-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 15l-2 5l9-13h-6l2-5-9 13h6z" }) }),
              "Leaderboard"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectWallet, {})
    ] })
  ] }) });
}
export {
  ConnectWallet as C,
  Nav as N
};
