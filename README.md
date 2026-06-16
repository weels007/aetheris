# Aetheris // Quorum — A Game for GenLayer

> An interactive web game that teaches & celebrates **GenLayer**'s intelligent blockchain — where Large Language Models act as validators reaching **Optimistic Democracy** consensus on subjective truths.

![tech](https://img.shields.io/badge/TanStack_Start-v1-06b6d4) ![react](https://img.shields.io/badge/React-19-61dafb) ![tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![genlayer](https://img.shields.io/badge/GenLayer-Python-4CAF50)

---

## Apa ini?

**Aetheris // Quorum** adalah simulator validator GenLayer berbentuk game. Pemain berperan sebagai sebuah node validator yang harus membaca proposal transaksi (dalam bahasa natural) dan memberi suara `APPROVE` atau `REJECT` sebelum waktu habis.

**Fitur utama:**

- **MetaMask Integration** - Connect wallet sebelum bermain
- **GenLayer Intelligent Contract** - Python contract dengan LLM judge
- **Optimistic Democracy** - Konsensus via `prompt_comparative`
- **On-chain Stats** - Score, GEN balance, reputation tersimpan di blockchain

---

## Gameplay

- **8 ronde** per sesi, dipilih acak dari pool 12+ skenario
- **15 detik** per ronde untuk membuat keputusan
- **5 kategori**: DeFi, Prediction Markets, AI Contracts, Governance, Oracle
- **Leader Validator** - 1 leader untuk consensus cepat
- **LLM Judge** - Vote dievaluasi oleh AI on-chain

### Rank berdasarkan akurasi

| Akurasi | Rank              |
| ------- | ----------------- |
| >= 90%  | GENESIS VALIDATOR |
| >= 75%  | TRUSTED NODE      |
| >= 50%  | PROBATIONARY      |
| < 50%   | SLASHED           |

---

## Struktur Project

```
aetheris/
├── contracts/
│   └── aetheris_game.py      # GenLayer Intelligent Contract (Python)
├── src/
│   ├── routes/
│   │   ├── __root.tsx        # Shell + WalletProvider
│   │   ├── index.tsx         # Landing page
│   │   └── play.tsx          # Game page
│   ├── components/
│   │   ├── Nav.tsx           # Navigation + wallet status
│   │   └── ConnectWallet.tsx # MetaMask connect button
│   ├── lib/
│   │   └── genlayer/
│   │       ├── wallet.tsx    # WalletContext (genlayer-js)
│   │       └── contract.ts   # Contract interaction wrapper
│   ├── game/
│   │   └── scenarios.ts      # Game scenarios
│   └── styles.css            # Design system
├── .env                      # Environment variables
└── package.json
```

---

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment

Copy `.env.example` ke `.env` dan isi contract address:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_CONTRACT_ADDRESS=0xBd61C2C7ac785ff67a03B3c25D474Dda8aF0CfeA
```

### 3. Deploy Contract

1. Buka [GenLayer Studio](https://studio.genlayer.com)
2. Buat contract baru
3. Copy paste isi `contracts/aetheris_game.py`
4. Deploy dan copy contract address

### 4. Jalankan

```bash
npm run dev
```

Buka [http://localhost:8080](http://localhost:8080)

---

## Contract Functions

### Write Functions

| Function                                          | Deskripsi                   |
| ------------------------------------------------- | --------------------------- |
| `register(alias)`                                 | Daftar player baru (+1 GEN) |
| `start_session()`                                 | Mulai sesi game             |
| `vote_round(proposal, vote, context, difficulty)` | Vote + LLM judge            |
| `end_session()`                                   | Akhiri sesi, update stats   |

### View Functions

| Function                   | Output |
| -------------------------- | ------ |
| `is_registered(addr)`      | bool   |
| `get_gen(addr)`            | u256   |
| `get_rep(addr)`            | u256   |
| `get_score(addr)`          | u256   |
| `get_stats(addr)`          | string |
| `has_active_session(addr)` | bool   |
| `get_session_stats(addr)`  | string |
| `get_last_vote(addr)`      | string |
| `get_total_players()`      | u256   |
| `get_total_games()`        | u256   |
| `get_total_votes()`        | u256   |

---

## Tech Stack

- **Frontend**: React 19 + TanStack Start + Tailwind CSS v4
- **Wallet**: MetaMask via `genlayer-js` SDK
- **Contract**: GenLayer Intelligent Contract (Python)
- **Consensus**: Optimistic Democracy via `prompt_comparative`

---

## Disclaimer

Project ini adalah **karya fan-made / edukasional** dan **tidak berafiliasi dengan GenLayer Foundation**. Semua trademark milik pemiliknya masing-masing.

Pelajari GenLayer lebih lanjut di [genlayer.com](https://genlayer.com).

---

## Lisensi

MIT
