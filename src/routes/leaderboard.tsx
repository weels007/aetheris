import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { useWallet } from "@/lib/genlayer/wallet";
import { AetherisGameContract, type LeaderboardEntry } from "@/lib/genlayer/contract";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard · Aetheris // Quorum" },
      {
        name: "description",
        content: "Global leaderboard for Aetheris validators on GenLayer.",
      },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { client } = useWallet();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-xl border border-primary/40 bg-card glow p-10 relative overflow-hidden scanlines">
          <div className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            // global_leaderboard
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground">
            Top validators ranked by AI consensus score on GenLayer
          </p>

          {loading ? (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 text-muted-foreground">
                <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="font-mono text-sm">Loading leaderboard...</span>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="text-6xl mb-4">◇</div>
              <div className="font-mono text-lg text-muted-foreground">No entries yet</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first validator to complete a session!
              </p>
              <Link
                to="/play"
                className="mt-6 inline-block rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition"
              >
                Start Playing
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                <span className="w-12">#</span>
                <span>Validator</span>
                <span className="text-right">Score</span>
                <span className="text-right w-16">Accuracy</span>
              </div>
              <div className="divide-y divide-border">
                {entries.map((entry, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 items-center transition ${
                      i < 3 ? "bg-primary/5" : ""
                    }`}
                  >
                    <span
                      className={`w-12 font-mono text-lg font-bold ${
                        i === 0
                          ? "text-yellow-500"
                          : i === 1
                            ? "text-gray-400"
                            : i === 2
                              ? "text-amber-600"
                              : "text-muted-foreground"
                      }`}
                    >
                      {medals[i] || `${i + 1}`}
                    </span>
                    <div>
                      <div className="font-mono text-sm font-medium">{entry.name}</div>
                      <div className="text-xs text-muted-foreground">{entry.address}</div>
                    </div>
                    <span className="font-mono text-lg font-bold text-primary">{entry.score}</span>
                    <span
                      className={`font-mono text-sm text-right w-16 ${
                        entry.accuracy >= 90
                          ? "text-success"
                          : entry.accuracy >= 50
                            ? "text-warning"
                            : "text-destructive"
                      }`}
                    >
                      {entry.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/play"
              className="rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition"
            >
              Play Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
