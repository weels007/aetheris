import { useWallet } from "@/lib/genlayer/wallet";

export function ConnectWallet() {
  const { address, isConnected, isConnecting, connect, disconnect, error } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-2">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="rounded-md border border-border bg-card/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <span className="size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12V7H5a2 2 0 010-4h14v4" />
              <path d="M3 5v14a2 2 0 002 2h16v-5" />
              <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
      {error && <span className="font-mono text-xs text-destructive">{error}</span>}
    </div>
  );
}
