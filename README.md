# Aetheris // Quorum

> AI-powered consensus game on GenLayer. Players vote on scenarios, and intelligent contracts judge who's right.

![tech](https://img.shields.io/badge/TanStack_Start-v1-06b6d4) ![react](https://img.shields.io/badge/React_19-61dafb) ![tailwind](https://img.shields.io/badge/Tailwind_v4-38bdf8) ![genlayer](https://img.shields.io/badge/GenLayer_Python-4CAF50)

---

## What is this?

Aetheris is a real-time consensus game. Players vote on scenarios, and GenLayer's intelligent contracts use AI to judge which answer is truly the best. No central authority, just collective intelligence verified on-chain.

- **Wallet-first** — connect MetaMask before playing
- **On-chain evaluation** — AI consensus decides the correct answer
- **Leaderboard** — scores tracked permanently on blockchain
- **3 rounds** per session, random scenarios each time

---

## How it works

1. Connect MetaMask wallet
2. Register player name (stored on-chain)
3. Start session — 3 rounds of random scenarios
4. Each round: read proposal, vote APPROVE or REJECT (30s timer)
5. Submit all votes → GenLayer validators evaluate via AI consensus
6. Score added to on-chain leaderboard

---

## Setup

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_CONTRACT_ADDRESS=0x8a7f9202f7d53E03d6F4d3fDfc1a8fee96b6455C
```

### Deploy contract (optional)

```bash
npx genlayer deploy contracts/aetheris_game.py
```

Update `VITE_CONTRACT_ADDRESS` with new address.

### Run

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

---

## Contract

`contracts/aetheris_game.py` — Python intelligent contract on GenLayer.

| Function | Type | Description |
| --- | --- | --- |
| `register(alias)` | write | Register player (+1 GEN) |
| `start_session()` | write | Start 3-round session |
| `evaluate_session(votes_json)` | write | Submit votes + AI consensus |
| `is_registered(addr)` | view | Check registration |
| `get_gen(addr)` | view | Get GEN balance |
| `get_score(addr)` | view | Get total score |
| `get_leaderboard()` | view | Top 20 players |

---

## Tech Stack

- React 19 + TanStack Start + Tailwind CSS v4
- MetaMask via `genlayer-js`
- GenLayer Intelligent Contract (Python)
- AI consensus via `strict_eq`

---

## License

MIT
