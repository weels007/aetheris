import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createClient, s as studionet } from "../_libs/genlayer-js.mjs";
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
import "../_libs/viem.mjs";
import "../_libs/ox.mjs";
import "../_libs/abitype.mjs";
import "../_libs/noble__hashes.mjs";
import "node:crypto";
import "../_libs/noble__curves.mjs";
const appCss = "/assets/styles-BJu7nSa3.css";
const STUDIONET_CHAIN_ID_HEX = "0xF22F";
const NATIVE_CURRENCY = { name: "GEN", symbol: "GEN", decimals: 18 };
const WalletContext = reactExports.createContext(void 0);
async function switchToStudionet() {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: STUDIONET_CHAIN_ID_HEX }]
    });
  } catch (err) {
    const switchErr = err;
    if (switchErr.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: STUDIONET_CHAIN_ID_HEX,
            chainName: "GenLayer Studio",
            nativeCurrency: NATIVE_CURRENCY,
            rpcUrls: ["https://studio.genlayer.com/api"],
            blockExplorerUrls: ["https://studio.genlayer.com/explorer"]
          }
        ]
      });
    }
  }
}
function createClientForAccount(address) {
  return createClient({
    chain: studionet,
    account: address,
    provider: window.ethereum
  });
}
function WalletProvider({ children }) {
  const [address, setAddress] = reactExports.useState(null);
  const [isConnecting, setIsConnecting] = reactExports.useState(false);
  const [client, setClient] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const connect = reactExports.useCallback(async () => {
    if (!window.ethereum) {
      setError("No EVM wallet found. Please install MetaMask, Rabby, or any EVM wallet.");
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      const userAddress = accounts[0];
      await switchToStudionet();
      setAddress(userAddress);
      setClient(createClientForAccount(userAddress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
      setAddress(null);
      setClient(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);
  const disconnect = reactExports.useCallback(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "wallet_revokePermissions", params: [{ eth_accounts: null }] }).catch(() => {
      });
    }
    localStorage.removeItem("aetheris_playerName");
    setAddress(null);
    setClient(null);
    setError(null);
  }, []);
  reactExports.useEffect(() => {
    if (!window.ethereum) return;
    const eth = window.ethereum;
    eth.request({ method: "eth_accounts" }).then((result) => {
      const accounts = result;
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setClient(createClientForAccount(accounts[0]));
      }
    }).catch(console.error);
    const onAccountsChanged = (accounts) => {
      const acc = accounts;
      if (!acc.length) {
        setAddress(null);
        setClient(null);
      } else {
        setAddress(acc[0]);
        setClient(createClientForAccount(acc[0]));
      }
    };
    const onChainChanged = () => {
      if (address) {
        setClient(createClientForAccount(address));
      }
    };
    eth.on("accountsChanged", onAccountsChanged);
    eth.on("chainChanged", onChainChanged);
    return () => {
      eth.removeListener("accountsChanged", onAccountsChanged);
      eth.removeListener("chainChanged", onChainChanged);
    };
  }, [address]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    WalletContext.Provider,
    {
      value: {
        address,
        isConnected: !!address,
        isConnecting,
        client,
        connect,
        disconnect,
        error
      },
      children
    }
  );
}
function useWallet() {
  const context = reactExports.useContext(WalletContext);
  if (context === void 0) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$3 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aetheris // Quorum" },
      { name: "description", content: "Aetheris - GenLayer Intelligent Contract Game" },
      { property: "og:title", content: "Aetheris // Quorum" },
      { property: "og:description", content: "Aetheris - GenLayer Intelligent Contract Game" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$3.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$2 = () => import("./play-CfL-0mAA.mjs");
const Route$2 = createFileRoute("/play")({
  head: () => ({
    meta: [{
      title: "Play · Aetheris // Quorum"
    }, {
      name: "description",
      content: "Play as a GenLayer AI validator. Reach Optimistic Democracy consensus and earn GEN."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./leaderboard-CCekm9Xu.mjs");
const Route$1 = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [{
      title: "Leaderboard · Aetheris // Quorum"
    }, {
      name: "description",
      content: "Global leaderboard for Aetheris validators on GenLayer."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CeIWNJ0j.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Aetheris // Quorum — A Game for GenLayer"
    }, {
      name: "description",
      content: "Step into the world of GenLayer's Intelligent Contracts. Become a validator, reach Optimistic Democracy consensus, and earn GEN."
    }, {
      property: "og:title",
      content: "Aetheris // Quorum — A Game for GenLayer"
    }, {
      property: "og:description",
      content: "An interactive game inspired by GenLayer's AI-powered blockchain validators."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const PlayRoute = Route$2.update({
  id: "/play",
  path: "/play",
  getParentRoute: () => Route$3
});
const LeaderboardRoute = Route$1.update({
  id: "/leaderboard",
  path: "/leaderboard",
  getParentRoute: () => Route$3
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  LeaderboardRoute,
  PlayRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  useWallet as u
};
