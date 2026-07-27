# Anonymous Mental Health Survey — Level 3 Project Proposal

## 📋 Executive Summary
Mental health assessments and psychological evaluations provide vital insights for healthcare providers, academic institutions, and employers. However, individuals frequently abstain from participating or falsify their responses due to fear of social stigma, employment repercussions, identity leakage, or unconsented data monetization. 

The **Anonymous Mental Health Survey** is a decentralized, privacy-preserving web application built on the **Midnight Network**. Utilizing Compact smart contracts, zero-knowledge proofs (zk-SNARKs), and client-side proof generation, the application enables users to submit sensitive psychological ratings (Mood, Anxiety, Stress) with mathematical guarantees that their personal identity and individual scores remain private while contributing to public aggregate mental health analytics.

---

## 🎯 Problem Statement
In traditional digital survey platforms:
1. **Centralized Data Storage**: User responses are linked to IP addresses, browser fingerprints, email addresses, or user accounts on centralized database servers.
2. **Fear of Retaliation**: Participants under-report severe symptoms (e.g., workplace depression, acute burnout) due to concern over privacy breaches.
3. **Lack of Verifiable Integrity**: Survey runners cannot prove the authenticity of public statistics without releasing raw individual records, creating a fundamental tension between data integrity and participant privacy.

---

## ⚠️ Existing Challenges
- **Data Breaches & Leakage**: Centralized healthcare databases are high-value targets for cyberattacks.
- **Compliance Restrictions**: Strict data privacy regulations (HIPAA, GDPR) impose severe compliance burdens on entities hosting sensitive wellness data.
- **Selective Reporting**: Organization-wide mental health metrics are often skewed due to non-participation driven by distrust.

---

## 💡 Proposed Solution
By leveraging Midnight's dual-state architecture (private client-side state and public ledger state):
- **Client-Side ZK Proof Generation**: Individual ratings (1–5) are validated and computed strictly within the participant's local browser environment.
- **Privacy-Preserving On-Chain Aggregation**: The Compact smart contract updates aggregate statistical counters (`totalSubmissions`, `totalMoodScore`, `lowRiskCount`, `moderateRiskCount`, `highRiskCount`) without disclosing individual responses or participant identities on-chain.
- **Cryptographic Verifiability**: Any observer can independently verify that public aggregate metrics accurately reflect valid, policy-compliant participant submissions.

---

## 🚀 Objectives
1. **Zero-Knowledge Privacy**: Ensure 100% anonymization of participant survey inputs and identity metadata.
2. **Verifiable Analytics**: Provide real-time aggregate health metrics for researchers, organizations, and public health officials.
3. **Seamless Web3 UX**: Deliver a modern, high-performance React dashboard with smooth wallet interaction and real-time transaction feedback.
4. **Production Readiness**: Provide robust unit testing, CI/CD automation, and multi-network deployment compatibility (Local Devnet, Testnet, Mainnet).

---

## 🔒 Privacy Model
| Data Attribute | Exposure Level | Storage Location | Cryptographic Mechanism |
| :--- | :--- | :--- | :--- |
| **Individual Survey Scores** | Strictly Private | Local Browser / Prover Memory | Circuit Witness / Local ZK Prover |
| **Participant Identity / Address** | Strictly Private | Local Wallet (Lace / Devnet) | Zero-Knowledge Shielded Prover |
| **Aggregate Submission Counter** | Public Ledger | Midnight Blockchain Ledger | On-Chain Compact State |
| **Aggregate Risk Categorization** | Public Ledger | Midnight Blockchain Ledger | On-Chain Compact State |
| **Composite Score Totals** | Public Ledger | Midnight Blockchain Ledger | On-Chain Compact State |

---

## 🔄 Zero-Knowledge Workflow
```mermaid
sequenceDiagram
    autonumber
    actor Participant as Participant Browser
    participant Prover as Client-Side ZK Prover
    participant Contract as Compact Smart Contract
    participant Ledger as Midnight Public Ledger

    Participant->>Prover: 1. Input private survey scores (Mood: 1-5, Anxiety: 1-5, Stress: 1-5)
    Note over Prover: 2. Assert score validity & calculate risk range locally
    Prover->>Prover: 3. Construct ZK Proof of valid survey submission
    Prover->>Contract: 4. Submit ZK Proof & state transition to Midnight Node
    Contract->>Ledger: 5. Verify ZK Proof on-chain
    Ledger-->>Participant: 6. Increment aggregate statistics (totalSubmissions, risk counters)
```

---

## 🧩 Midnight Components
- **Compact Language Compiler**: Compiles `contracts/hello-world.compact` into TypeScript interfaces, ZKIR (Zero-Knowledge Intermediate Representation), and prover/verifier keys.
- **Client-Side Proof Server**: Generates zk-SNARK proofs locally on port 6300 without transmitting private inputs over the network.
- **Midnight Standalone Node**: Executes contract circuits on port 9944 and maintains consensus.
- **Midnight Indexer**: Queries on-chain contract state via GraphQL on port 8088.

---

## 🏗️ Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                        React + TypeScript Frontend                      │
│     (Navbar, Survey Form, Real-Time Analytics, History, Wellness)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Midnight SDK & Local Provider                     │
│    (Private State Provider, HTTP Proof Provider, Public Data Provider) │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌───────────────────────────────┐   ┌───────────────────────────────────┐
│     Client-Side Proof Server  │   │     Midnight Node & Indexer       │
│         (Port 6300)           │   │      (Port 9944 / Port 8088)      │
└───────────────────────────────┘   └───────────────────────────────────┘
```

---

## 🛠️ Technology Stack
- **Smart Contract**: Midnight Compact (v0.23+)
- **Frontend Framework**: React 18, TypeScript 5.9, Vite 5
- **Styling**: TailwindCSS, Glassmorphism, Lucide React Icons
- **Blockchain Libraries**: `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/midnight-js-contracts`, `@midnight-ntwrk/wallet-sdk`
- **Testing & Tooling**: Node.js 22+, `tsx`, TAP test suite
- **DevOps**: Docker Compose, GitHub Actions CI/CD

---

## 📂 Repository Structure
```
anonymous-mental-health-survey/
├── .github/workflows/ci.yml   # GitHub Actions CI/CD workflow
├── contracts/
│   ├── hello-world.compact    # Compact ZK smart contract source
│   └── managed/hello-world/   # Compiled ZKIR, contract & prover keys
├── frontend/                  # React + Vite web dashboard
│   ├── src/
│   │   ├── components/        # UI components (Navbar, Analytics, Survey, etc.)
│   │   ├── types/             # TypeScript type declarations
│   │   ├── App.tsx            # Main application logic
│   │   └── main.tsx           # Entry point
│   └── package.json
├── src/                       # TypeScript deployment & network scripts
│   ├── deploy.ts
│   ├── setup.ts
│   └── network.ts
├── tests/                     # Automated unit and integration tests
│   └── run-all-tests.ts
├── docker-compose.yml         # Local Midnight node & proof server configuration
├── package.json               # Root dependencies & scripts
├── PROPOSAL.md                # Project proposal document
└── README.md                  # Complete technical documentation
```

---

## 🛡️ Security Model
1. **Assertion Boundaries**: Circuit execution enforces strict score boundaries (`1 <= score <= 5`). Out-of-bounds inputs fail client-side proof construction.
2. **Identity Decoupling**: No participant wallet address or session metadata is passed to the ZK circuit or stored on-chain.
3. **Immutability & Auditability**: Once submitted, aggregate statistics are immutably stored on the Midnight blockchain ledger.

---

## 📈 Expected Impact
- **Empowered Participants**: Individuals can candidly report mental health struggles without fear of privacy loss or discrimination.
- **Accurate Public Health Data**: Researchers and organizational administrators receive high-integrity, tamper-proof wellness metrics.
- **Pioneering ZK Adoption**: Demonstrates practical utility of zero-knowledge privacy in everyday healthcare and social surveys.

---

## 🔮 Future Enhancements
1. **Multi-Domain Surveys**: Support for customized questionnaire schemas (e.g., PHQ-9, GAD-7 standardized clinical scales).
2. **Role-Based Access Control**: ZK role verification for organization-specific survey access.
3. **Lace Wallet Integration**: Direct browser-extension wallet signing via `@midnight-ntwrk/dapp-connector-api`.

---

## 📝 Conclusion
The **Anonymous Mental Health Survey** demonstrates how Midnight's zero-knowledge infrastructure resolves the historic conflict between individual privacy and public data integrity. By combining Compact smart contracts with a user-friendly Web3 interface, this project establishes a new standard for confidential healthcare data collection.
