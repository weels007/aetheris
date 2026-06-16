import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useWallet } from "@/lib/genlayer/wallet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aetheris // Quorum — A Game for GenLayer" },
      {
        name: "description",
        content:
          "Step into the world of GenLayer's Intelligent Contracts. Become a validator, reach Optimistic Democracy consensus, and earn GEN.",
      },
      { property: "og:title", content: "Aetheris // Quorum — A Game for GenLayer" },
      {
        property: "og:description",
        content: "An interactive game inspired by GenLayer's AI-powered blockchain validators.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    tag: "AI Validators",
    title: "LLMs as Consensus",
    desc: "GenLayer uses Large Language Models as decentralized validators that interpret natural language and reach consensus on subjective outcomes.",
  },
  {
    tag: "Optimistic Democracy",
    title: "Probabilistic Truth",
    desc: "Instead of one deterministic answer, validators converge through majority voting — solving disputes that traditional blockchains can't.",
  },
  {
    tag: "Intelligent Contracts",
    title: "Beyond Smart Contracts",
    desc: "Contracts can call the web, parse tweets, evaluate sentiment, resolve prediction markets, and run actual reasoning on-chain.",
  },
  {
    tag: "Web Access",
    title: "Native Internet I/O",
    desc: "Validators can fetch live data from the open web — no oracle middleman required for most use cases.",
  },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    t: "Receive Proposal",
    d: "A transaction request lands in the mempool with natural-language context.",
  },
  {
    n: "02",
    t: "Read the Context",
    d: "As a validator, evaluate evidence, oracle feeds, and the prompt.",
  },
  { n: "03", t: "Vote APPROVE / REJECT", d: "Cast your vote before the timer expires." },
  {
    n: "04",
    t: "Reach Consensus",
    d: "If you match the majority of AI validators, you earn GEN and reputation.",
  },
];

function Landing() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 mb-6">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                Mainnet sim · v1.0
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Become an <span className="text-gradient">AI validator</span>
              <br />
              on the intelligent chain.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              <span className="font-mono text-foreground">Aetheris // Quorum</span> is an
              interactive simulator of <strong className="text-foreground">GenLayer</strong> — the
              blockchain where LLMs reach Optimistic Democracy on subjective truths. Vote on
              proposals, match the network majority, and climb the validator ladder.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {isConnected ? (
                <Link
                  to="/play"
                  className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 font-mono uppercase tracking-widest text-sm text-primary-foreground glow hover:scale-[1.02] transition"
                >
                  ▶ Convene the Quorum
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <ConnectWallet />
                  <span className="font-mono text-xs text-muted-foreground">
                    Connect wallet to start playing
                  </span>
                </div>
              )}
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-mono uppercase tracking-widest text-sm text-muted-foreground hover:text-foreground hover:border-primary transition"
              >
                How it works ↓
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { v: "12+", l: "Scenarios" },
                { v: "5", l: "Categories" },
                { v: "∞", l: "Replayability" },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-primary/60 pl-3">
                  <div className="font-mono text-3xl font-bold text-gradient">{s.v}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* floating terminal */}
          <div className="hidden lg:block absolute right-6 top-24 w-[420px] animate-float">
            <div className="rounded-lg border border-primary/40 bg-card/90 backdrop-blur-xl glow overflow-hidden relative scanlines">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/50">
                <span className="size-2 rounded-full bg-destructive" />
                <span className="size-2 rounded-full bg-warning" />
                <span className="size-2 rounded-full bg-success" />
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  validator.node
                </span>
              </div>
              <pre className="p-5 font-mono text-xs leading-relaxed text-muted-foreground">
                {`> connecting to genlayer...
> validator stake: 1,000 GEN
> consensus mode: optimistic
> awaiting proposal...

[PROPOSAL #04827]
category: PREDICTION
prompt:  "Will BTC > $80k Dec 31?"
oracle:  $93,712 (4 sources)

[YOUR VOTE] _`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-primary mb-2">
                # genlayer_primitives
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Built on real GenLayer features.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Every game mechanic mirrors how the actual protocol works under the hood.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-card p-8 hover:bg-secondary/40 transition group relative"
              >
                <div className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                  {f.tag}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition">
                  {f.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-primary mb-2">
              // gameplay_loop
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Four steps to consensus.</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="rounded-lg border border-border bg-card p-6 h-full hover:border-primary transition">
                  <div className="font-mono text-5xl font-bold text-gradient">{s.n}</div>
                  <h3 className="mt-4 text-xl font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-primary text-2xl font-mono">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Ready to validate the <span className="text-gradient">future</span>?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Connect your MetaMask wallet to the GenLayer testnet and start reaching consensus.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            {isConnected ? (
              <Link
                to="/play"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-8 py-4 font-mono uppercase tracking-widest text-primary-foreground glow hover:scale-[1.02] transition"
              >
                ▶ Enter the Quorum
              </Link>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="font-mono">
            // not affiliated with GenLayer Foundation — fan-made educational game
          </div>
          <div className="font-mono">© {new Date().getFullYear()} Aetheris // Quorum</div>
        </div>
      </footer>
    </div>
  );
}
