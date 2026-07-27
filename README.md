# Anonymous Mental Health Survey — Midnight Protocol

> **Midnight Protocol Application** | Zero-Knowledge Privacy-Preserving Health Analytics & Feedback Platform  
> Built with Compact Smart Contracts + Midnight JS SDK + React + TypeScript + Glassmorphism Design System

[![Midnight Protocol](https://img.shields.io/badge/Midnight-Protocol%20v4.1.1-7c3aed.svg)](https://midnight.network)
[![Compact Compiler](https://img.shields.io/badge/Compact-v0.5.1-6366f1.svg)](https://github.com/midnightntwrk/compact)
[![CI Workflow](https://github.com/Suchismita40/anonymous-mental-health-survey/actions/workflows/ci.yml/badge.svg)](https://github.com/Suchismita40/anonymous-mental-health-survey/actions/workflows/ci.yml)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black.svg?logo=vercel)](https://anonymous-mental-health-survey-k9k8-7ghn2d8t0-fiem.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717.svg?logo=github)](https://github.com/Suchismita40/anonymous-mental-health-survey)

---

## 📄 Proposal & Documentation Links
- 📘 **Full Level 3 Project Proposal**: Read the detailed technical document in [PROPOSAL.md](file:///Ubuntu/home/user/midnight-projects/anonymous-mental-health-survey/PROPOSAL.md) / [GitHub Proposal](https://github.com/Suchismita40/anonymous-mental-health-survey/blob/main/PROPOSAL.md).
- 🌐 **Live Web Application**: **[https://anonymous-mental-health-survey-k9k8-7ghn2d8t0-fiem.vercel.app](https://anonymous-mental-health-survey-k9k8-7ghn2d8t0-fiem.vercel.app)**
- ▶️ **YouTube Video Demo**: **[Watch the complete video walkthrough on YouTube](https://youtu.be/BSLeDq4-OzA)**

---

# Project Overview

**Anonymous Mental Health Survey** is a full-stack, Zero-Knowledge privacy-preserving healthcare analytics application built on the **Midnight Network**.

It enables individuals to submit confidential mental health assessments (Mood, Anxiety, and Stress scores rated 1–5) with mathematical privacy guarantees. Using Midnight's Compact smart contract toolchain, individual score entries are validated via Zero-Knowledge circuit assertions (`1 <= score <= 5`) and incorporated into public aggregate statistics on-chain—without disclosing participant identity, wallet address, or individual answers.

---

## 🔗 Contract Deployment Details

| Field | Value / Details |
| :--- | :--- |
| **Contract Address** | `a80bcd651aa8d5dd9465a6a642a454678da0dc1b039cf3ac5f9afacf79f7ceb2` |
| **Active Network** | Midnight Local Devnet (`undeployed`) |
| **Deployer Address** | `mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s` |
| **Deployment Status** | Deployed & Active |
| **Deployment Date** | `2026-07-25T05:52:16.351Z` |
| **Explorer / Indexer Link**| `http://127.0.0.1:8088/api/v4/graphql` (Local Indexer) / `https://explorer.midnight.network` |
| **Deployment Method** | Midnight JS SDK (`npx tsx src/deploy.ts`) |

---

# Application Screenshots

### 1. Landing Page & Analytics Dashboard
<p align="center">
  <img src="assets/landing-page.png" alt="Landing Page Dashboard" width="100%">
</p>

### 2. Anonymous Survey History
<p align="center">
  <img src="assets/survey-history.png" alt="Anonymous Survey History" width="100%">
</p>

### 3. Personalised Wellness Recommendations
<p align="center">
  <img src="assets/wellness-recommendations.png" alt="Personalised Wellness Recommendations" width="100%">
</p>

### 4. Interactive Report Summary
<p align="center">
  <img src="assets/report-page.png" alt="Interactive Report Summary" width="100%">
</p>

---

## 🧠 Witness Inputs

The `contracts/hello-world.compact` contract defines how private survey inputs are processed in Midnight's client-side zero-knowledge environment.

### Circuit Parameters & Witnesses
When a participant calls `submitSurveyResponse(moodScore, anxietyScore, stressScore)`:

1. **Private Circuit Arguments / Witnesses**:
   - `moodScore: Uint<8>` (Value: 1–5)
   - `anxietyScore: Uint<8>` (Value: 1–5)
   - `stressScore: Uint<8>` (Value: 1–5)

2. **Client-Side Assertions (Zero-Knowledge Validation)**:
   - `assert(isSurveyActive, "Survey is currently closed");`
   - `assert(moodScore >= 1 && moodScore <= 5, "Mood score must be between 1 and 5");`
   - `assert(anxietyScore >= 1 && anxietyScore <= 5, "Anxiety score must be between 1 and 5");`
   - `assert(stressScore >= 1 && stressScore <= 5, "Stress score must be between 1 and 5");`

3. **What Remains Private**:
   - Participant Wallet Identity (`mn_addr_...` is never passed to circuit or published on-chain)
   - IP Address & Browser Metadata
   - Private key material and local state stored in LevelDB

4. **What Becomes Public On-Chain**:
   - Aggregate Submissions Counter (`totalSubmissions`)
   - Composite Score Totals (`totalMoodScore`, `totalAnxietyScore`, `totalStressScore`)
   - Risk Category Distribution Counters (`lowRiskCount`, `moderateRiskCount`, `highRiskCount`)

---

## 🔒 Privacy & Security Model

| Component | Confidentiality Mechanism | Public Ledger Exposure |
| :--- | :--- | :--- |
| **User Identity** | Shielded address & local private state | **None** (Anonymous) |
| **Survey Ratings** | Prover circuit assertions | **None** (Only aggregate sum updated) |
| **Risk Classification** | Local composite computation (`mood + anxiety + stress`) | Increments risk bracket count on-chain (+1) |
| **Contract Status** | Circuit access flag (`isSurveyActive`) | Boolean flag queryable on-chain |

---

## 👛 Lace Wallet Integration & Web3 API Status

The application includes built-in support for browser wallet connection via `window.midnight?.lace`:

- **Wallet Detection**: Automatically detects whether the Midnight Lace browser extension is injected (`isLaceAvailable`).
- **Permission Flow**: Clicking **Connect Lace Wallet** invokes `window.midnight.lace.enable()`, triggering the genuine browser wallet permission prompt.
- **Graceful Fallback**: If Lace Wallet is not installed or when running in local Docker devnet mode, the application gracefully alerts the user and seamlessly bridges to the local devnet wallet provider (`mn_addr_undeployed1...`).
- **Network Compatibility**: Fully supports switching between Local Devnet, Midnight Testnet, and Mainnet environments via `.env` configuration (`VITE_NETWORK`).

> **Note on Verification**: The interface detects genuine browser extension events. In local devnet environments where browser extensions cannot connect directly to local standalone containers, the app safely falls back to local devnet account state.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React + TypeScript Frontend                      │
│     (Navbar, Survey Form, Real-Time Analytics, History, Wellness)      │
└───────────────────┬────────────────────────────────────┬───────────────┘
                    │                                    │
                    ▼                                    ▼
┌──────────────────────────────────────┐   ┌───────────────────────────────┐
│     Client-Side Proof Server         │   │      Midnight Standalone Node │
│        (Port 6300 ZK Prover)         │   │        (Port 9944 Consensus)  │
└───────────────────┬──────────────────┘   └─────────────┬─────────────────┘
                    │                                    │
                    └──────────────────┬─────────────────┘
                                       ▼
                         ┌───────────────────────────┐
                         │   GraphQL Indexer API     │
                         │    (Port 8088 Queries)    │
                         └───────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Smart Contract** | Midnight Compact (`v0.23+`) | ZK circuits, risk calculations, ledger state |
| **ZK Toolchain** | `@midnight-ntwrk/compact-runtime` | Local zk-SNARK proof construction |
| **Frontend** | React 18, TypeScript 5.9, Vite 5 | Reactive Web3 dashboard UI |
| **Styling** | Vanilla CSS Glassmorphism + TailwindCSS | Dark-mode design system & micro-animations |
| **Testing** | Node.js Test Runner / TAP | Automated unit & contract assumption tests |
| **CI/CD** | GitHub Actions (`ci.yml`) | Automated build, test, and type-check workflow |

---

## 💻 Installation & Local Development

### Prerequisites
- **Node.js**: `v22.0.0` or higher
- **Docker Desktop / Docker Engine**: Active and running (for local devnet)

### 1. Clone Repository
```bash
git clone https://github.com/Suchismita40/anonymous-mental-health-survey.git
cd anonymous-mental-health-survey
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start Local Midnight Devnet & Proof Server
```bash
npm run proof-server:start
```

### 4. Compile Compact Contract
```bash
npm run compile
```

### 5. Deploy Contract to Local Devnet
```bash
npm run deploy
```

### 6. Run Frontend Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing & Quality Assurance

Run the automated test suite to verify contract rules, score boundaries, network configuration, and UI logic:

```bash
npm test
```

### Test Coverage Highlights:
- ✅ **Score Range Validation**: Asserts 1–5 bounds for mood, anxiety, and stress ratings.
- ✅ **Risk Index Categorization**: Verifies Low Risk (3–6), Moderate Risk (7–10), and High Risk (11–15) bracket calculations.
- ✅ **Privacy Preservation Assertions**: Verifies that individual survey answers are omitted from public ledger state.
- ✅ **Network Configuration**: Validates fallback endpoints and chain configurations.
- ✅ **UI Logic**: Validates Bech32 address truncation and risk badge styling rules.

---

## ⚙️ CI/CD Pipeline

The project includes an automated GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every `push` and `pull_request` to `main`:

1. **Environment Setup**: Installs Node.js 22.x with npm caching.
2. **Dependency Verification**: Runs clean installs (`npm ci`).
3. **Artifact Integrity**: Validates compiled `contracts/managed/hello-world` ZKIR binaries.
4. **Automated Testing**: Executes the full TAP unit test suite.
5. **Type Checking & Build**: Runs `tsc --noEmit` and Vite production build.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
