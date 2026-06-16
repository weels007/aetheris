import { Link } from "@tanstack/react-router";
import { ConnectWallet } from "./ConnectWallet";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-9 rounded-sm bg-gradient-to-br from-primary to-accent grid place-items-center font-display text-primary-foreground font-bold italic animate-pulse-glow">
            Æ
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display italic text-lg text-foreground">Aetheris</span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              // quorum · genlayer sim
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 text-sm">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="px-3 py-1.5 rounded-sm hover:text-foreground transition font-mono text-xs uppercase tracking-widest"
            >
              Index
            </Link>
            <Link
              to="/play"
              activeProps={{ className: "text-primary-foreground bg-primary glow" }}
              inactiveProps={{ className: "text-muted-foreground border border-border" }}
              className="px-4 py-1.5 rounded-sm hover:text-foreground transition font-mono uppercase tracking-[0.25em] text-xs"
            >
              ▸ Enter Quorum
            </Link>
            <Link
              to="/leaderboard"
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="px-3 py-1.5 rounded-sm hover:text-foreground transition font-mono text-xs uppercase tracking-widest flex items-center gap-1.5"
            >
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15l-2 5l9-13h-6l2-5-9 13h6z" />
              </svg>
              Leaderboard
            </Link>
          </nav>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
