export type Category = "DeFi" | "Prediction" | "AI Contract" | "Governance" | "Oracle";

export interface Scenario {
  id: string;
  category: Category;
  prompt: string;
  context: string;
  // The "true" optimistic answer (what the network's AI validators would converge on)
  truth: "APPROVE" | "REJECT";
  // Difficulty 1-3
  difficulty: number;
  rationale: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    category: "Prediction",
    prompt: "Resolve market: 'Will Bitcoin close above $80,000 on Dec 31, 2024?'",
    context: "Oracle feed reports BTC closed at $93,712 on Dec 31, 2024 across 4 major exchanges.",
    truth: "APPROVE",
    difficulty: 1,
    rationale: "Multiple oracle sources confirm the price exceeded the threshold.",
  },
  {
    id: "s2",
    category: "AI Contract",
    prompt: "Smart contract receives tweet: 'I love $GEN to the moon 🚀'. Sentiment positive?",
    context: "Contract pays out if LLM validators classify the tweet as POSITIVE sentiment.",
    truth: "APPROVE",
    difficulty: 1,
    rationale: "Clearly positive sentiment — emoji and bullish language.",
  },
  {
    id: "s3",
    category: "DeFi",
    prompt: "Liquidation request for vault #4827. Collateral ratio: 142%. Threshold: 150%.",
    context: "GenLayer LLM validators must approve liquidations below 150% CR.",
    truth: "APPROVE",
    difficulty: 2,
    rationale: "142% is below the 150% safety threshold — liquidation valid.",
  },
  {
    id: "s4",
    category: "Governance",
    prompt: "Proposal #19: Increase validator stake from 1000 GEN → 1,000,000 GEN overnight.",
    context: "DAO vote: 8% YES, 91% NO, 1% abstain. Quorum reached.",
    truth: "REJECT",
    difficulty: 1,
    rationale: "Overwhelming NO vote — proposal must be rejected.",
  },
  {
    id: "s5",
    category: "Oracle",
    prompt: "Confirm weather event: 'Hurricane made landfall in Florida on Oct 9, 2024'.",
    context: "NOAA, Reuters, and AP all report Hurricane Milton landfall on Oct 9, 2024.",
    truth: "APPROVE",
    difficulty: 2,
    rationale: "Three independent trusted sources confirm — Optimistic Democracy converges.",
  },
  {
    id: "s6",
    category: "AI Contract",
    prompt:
      "Insurance contract: User claims 'flight delayed >3hrs'. Airline API says 47 min delay.",
    context: "Pays out only if delay exceeds 3 hours per verified airline data.",
    truth: "REJECT",
    difficulty: 1,
    rationale: "Verified delay (47 min) does not meet the 3-hour threshold.",
  },
  {
    id: "s7",
    category: "Prediction",
    prompt: "Market: 'Will Team A win the championship?' — Game ended in a draw, pending replay.",
    context: "No conclusive outcome yet. Replay scheduled in 3 days.",
    truth: "REJECT",
    difficulty: 3,
    rationale: "Outcome is undetermined — resolving now would be premature.",
  },
  {
    id: "s8",
    category: "DeFi",
    prompt: "Cross-chain swap: 100 GEN → 0.0001 ETH. Market rate suggests 0.05 ETH.",
    context: "Slippage protection active. Quote is 500x off fair market.",
    truth: "REJECT",
    difficulty: 2,
    rationale: "Massive price deviation — likely oracle attack or front-run. Reject.",
  },
  {
    id: "s9",
    category: "Governance",
    prompt: "Proposal: Allocate 50,000 GEN to community education program. Vote: 72% YES.",
    context: "Treasury balance: 2.4M GEN. Quorum met. Sponsor verified.",
    truth: "APPROVE",
    difficulty: 1,
    rationale: "Healthy supermajority, treasury can afford, sponsor verified.",
  },
  {
    id: "s10",
    category: "Oracle",
    prompt: "Verify news: 'GenLayer mainnet launched in 1995'. Multiple anonymous blog posts.",
    context: "No authoritative source. GenLayer was founded long after 1995.",
    truth: "REJECT",
    difficulty: 2,
    rationale: "Claim contradicts known facts; sources are not authoritative.",
  },
  {
    id: "s11",
    category: "AI Contract",
    prompt:
      "Contract scrapes website price for 'iPhone 16'. Site says '$999'. Contract triggers buy below $800.",
    context: "Price ($999) is above trigger ($800).",
    truth: "REJECT",
    difficulty: 1,
    rationale: "Trigger condition not met — do not execute purchase.",
  },
  {
    id: "s12",
    category: "Prediction",
    prompt: "Market: 'Will an AI write a #1 NYT bestseller by 2030?' Current date: 2026.",
    context: "Event has not occurred. Market resolution date is 2030.",
    truth: "REJECT",
    difficulty: 3,
    rationale: "Resolution window still open — too early to settle.",
  },
];

export function randomScenarios(count: number): Scenario[] {
  const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
