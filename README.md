# Anonymous Mental Health Survey dApp 🛡️🧠

A full-stack, Zero-Knowledge privacy-preserving mental health survey and analytics dApp built on the **Midnight Network**.

> **Level 3 Category:** `Anonymous Feedback / Survey`  
> **Privacy Technology:** Compact Smart Contracts + Zero-Knowledge Proofs + Local Witness State

---

## 🌟 Product Proposal & Idea

Mental health surveys in workplaces, universities, and healthcare settings often suffer from severe underreporting, fear of retaliation, or dishonest responses due to privacy and data leak concerns. 

**Anonymous Mental Health Survey** solves this problem by enforcing mathematical privacy guarantees on the Midnight Network:
- **Private Witness**: Survey participants enter their private ratings (Mood, Anxiety, Stress scores from 1 to 5) locally.
- **Zero-Knowledge Circuit Execution**: A Compact smart contract circuit executes locally inside the user's browser/environment, validating score ranges (1..5) and computing risk categories without exposing individual answers or identity.
- **Public Aggregate Disclosures**: Only zero-knowledge proofs and aggregate metrics (total responses, average ratings, risk distribution percentages) are disclosed to the on-chain ledger.

---

## 🔒 Privacy Model & Claims

### 1. What Observers Can Learn (Public Ledger State)
- `totalSubmissions`: The total count of survey responses submitted on-chain.
- `totalMoodScore`, `totalAnxietyScore`, `totalStressScore`: Cumulative aggregate score sums used strictly for average score calculation.
- `lowRiskCount`, `moderateRiskCount`, `highRiskCount`: Aggregate response tallies categorized by risk index.
- `isSurveyActive`: Global Boolean status flag (Open / Closed for submissions).

### 2. What Observers CANNOT Learn (100% Confidential)
- ❌ **Individual Rating Scores**: No observer, node operator, or indexer can extract individual mood, anxiety, or stress scores.
- ❌ **Participant Identity**: No wallet address, IP, or participant identifier is linked to survey responses.
- ❌ **Individual Composite Ratings**: Individual total risk scores remain hidden inside local private witness state.

### 3. Explicit Disclosures (`disclose()` Usage)
In the Compact smart contract (`contracts/hello-world.compact`), `disclose()` is invoked intentionally and strictly for:
- `disclose(moodScore)` & `disclose(anxietyScore)` & `disclose(stressScore)`: Disclosing that public aggregate counters (`totalMoodScore`, `totalAnxietyScore`, `totalStressScore`) and risk distribution tallies are updated by +1 upon valid proof submission.
- `disclose(active)`: Disclosing state changes when toggling survey status between Open and Closed.

---

## 🚀 Quick Start & Setup Instructions

### System Prerequisites
- **OS & Environment**: WSL Ubuntu (Linux x86_64).
- **Node.js**: Node v22+ (`node -v`).
- **npm**: npm v10+ (`npm -v`).
- **Docker**: Docker & Docker Compose v2 (`docker compose version`).
- **Compact Compiler**: `compact 0.5.1` at `/home/<user>/.local/bin/compact`.

### 1. Installation
Clone the repository and install dependencies:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Compile Contract
Compile the Compact smart contract:

```bash
npm run compile
```

Outputs generated ZK circuits, parameters, and TypeScript bindings under `contracts/managed/hello-world/`.

### 3. Run Unit & Privacy Tests
Run the comprehensive test suite (6 tests across 3 suites):

```bash
npm test
```

### 4. Local Devnet Setup & Deployment
Bring up local Midnight devnet services (`node` port 9944, `indexer` port 8088, `proof-server` port 6300), compile, and deploy:

```bash
npm run setup -- --network undeployed
```

### 5. Run Interactive CLI
Interact with the deployed survey contract via interactive terminal UI:

```bash
npm run cli
```

Menu options:
1. Submit Anonymous Survey Response (Mood 1-5, Anxiety 1-5, Stress 1-5).
2. View Aggregate Survey Analytics & Statistics.
3. Toggle Survey Status (Open / Close).
4. Check Wallet Balance.
5. Exit.

### 6. Run E2E Smoke Test
Run automated read-back check against local devnet contract:

```bash
npm run test:e2e
```

### 7. Run Full-Stack Web Frontend
Launch Vite web frontend locally:

```bash
npm --prefix frontend run dev
```

Open `http://localhost:3000` in your browser.

---

## 🌐 Public Networks (Preview / Preprod) Deployment Status

### Preview / Preprod Target Configuration
To target Preview or Preprod testnet:

```bash
# Switch network and run setup
npm run setup -- --network preview
# OR
npm run setup -- --network preprod
```

### Deployment Status Summary
- **Local Devnet (`undeployed`)**: ✅ Fully deployed, indexed, tested, and verified on local Docker devnet.
- **Preview / Preprod Networks**:
  - `curl -I https://rpc.preprod.midnight.network` -> HTTP 405 (Reachable & Active).
  - `curl -I https://indexer.preprod.midnight.network/api/v4/graphql` -> HTTP 405 (Reachable & Active).
  - Faucet URLs: `https://midnight-tmnight-preview.nethermind.dev` / `https://midnight-tmnight-preprod.nethermind.dev`.
  - State file `.midnight-state.json` persists seeds and deployed contract addresses across network switches.

---

## 📋 Submission Checklist

### Level 1 Requirements Checklist
- [x] **Compact Contract**: Contains public ledger state, private witness inputs, explicit `disclose()`, compiles via `compact compile`, and outputs to `contracts/managed/`.
- [x] **Local Deployment**: `npm run setup -- --network undeployed` runs cleanly, and CLI interaction works.
- [x] **Preview / Preprod**: Deployment scripts support `--network preview` and `--network preprod` with persistent state file `.midnight-state.json`.
- [x] **README**: Complete setup, compile, local deploy, network status, public vs private witness, and product proposal sections included.
- [x] **Commits**: Git history contains structured, meaningful commits.

### Level 2 Requirements Checklist
- [x] **Lace Wallet Integration**: Connect button, disconnect button, wallet address display (`mn_addr_...`), and balance tracking.
- [x] **Contract Integration**: Loads contract address from `VITE_CONTRACT_ADDRESS`, network from `VITE_NETWORK`, and proof-server from `VITE_PROOF_SERVER_URL`.
- [x] **Privacy Behavior**: User inputs private ratings (1-5), local ZK proof is computed, and public aggregate analytics update.
- [x] **Deployment Ready**: Vite frontend configured for Vercel/Netlify deployment with `.env.example`.
- [x] **Commits**: Git history contains 5+ structured commits.

### Level 3 Requirements Checklist
- [x] **Tests Suite**: Added 3 test suites (`tests/contract-assumptions.test.ts`, `tests/network-config.test.ts`, `tests/privacy-model.test.ts`) covering score validation, network config, and privacy disclosures.
- [x] **CI/CD**: Added GitHub Actions workflow (`.github/workflows/ci.yml`) for lint, compile, tests, and build.
- [x] **Production Polish & UX**: Modern glassmorphism UI with vibrant gradients, loading/proving spinners, transaction receipts, and live risk breakdown charts.
- [x] **Product Proposal**: Detailed Level 3 proposal for `Anonymous Feedback / Survey` category.

---

## 📁 Repository Structure

```
anonymous-mental-health-survey/
├── contracts/
│   ├── hello-world.compact        # Compact ZK Smart Contract source
│   └── managed/                   # Compiled ZK circuits, parameters & TS definitions
├── frontend/                      # Full-stack Vite + React + TypeScript Web dApp
│   ├── src/
│   │   ├── components/            # Navbar, SurveyForm, AnalyticsDashboard, PrivacyCard
│   │   ├── App.tsx                # Main dApp dashboard & state manager
│   │   └── index.css              # Custom Glassmorphism & dark design system
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── scripts/
│   └── e2e-check.ts               # End-to-end smoke check
├── src/
│   ├── setup.ts                   # Orchestrator script for npm run setup
│   ├── deploy.ts                  # Contract deployment logic
│   ├── cli.ts                     # Interactive terminal CLI UI
│   ├── network.ts                 # Network configuration & persistent state
│   └── wallet.ts                  # Midnight Wallet SDK integration & sync cache
├── tests/                         # Test suite
│   ├── contract-assumptions.test.ts
│   ├── network-config.test.ts
│   ├── privacy-model.test.ts
│   └── run-all-tests.ts
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD workflow
├── docker-compose.yml             # Local devnet (node, indexer, proof-server)
├── package.json                   # Project dependencies & scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── .env.example                   # Root environment configuration template
└── README.md                      # Documentation
```

---

## 📄 License
MIT License
