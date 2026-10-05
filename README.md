# Smart-Escape

> **AI DevFest 2026 — AI Vibe-Coding Contest (Solo)**  
> **Interactive Emergency Evacuation Route Simulator**  
> Organized by the Computer and Programming Club (CPC), Department of CSE, Daffodil International University.

---

## 📌 Project Identity

- **Project Name:** Smart Escape
- **Participant:** Ratul (GitHub: [@Ratul-NotFound](https://github.com/Ratul-NotFound))
- **Repository:** [https://github.com/Ratul-NotFound/Smart-Escape](https://github.com/Ratul-NotFound/Smart-Escape)
- **Live Deployment:** *(To be deployed by T+90)*
- **License:** [MIT License](LICENSE)

---

## 📖 Overview

Smart Escape is an interactive browser-based emergency evacuation simulator. It models building topological graphs (rooms, junctions, weighted corridors, and exits) with dynamic hazards (blocked rooms, blocked corridors, and closed exits).

The core engine computes the lowest-cost evacuation path to an accessible exit in real-time using **Dijkstra's Algorithm / Uniform Cost Search** with exact multi-tier deterministic tie-breaking.

---

## 🏛️ Architecture & Governance Documentation

This repository maintains comprehensive architectural and operational standards:

| Document | Description |
| :--- | :--- |
| **[`AGENTS.md`](AGENTS.md)** | Operational constraints, 100% offline routing rules, and exact tie-breaking specifications. |
| **[`RULES.md`](RULES.md)** | Official contest timelines, commit standards, judging rubrics, and submission requirements. |
| **[`DESIGN.md`](DESIGN.md)** | Clean architecture, data models, Tactical EOC UI design tokens, and SVG canvas engine. |
| **[`PLANNING.md`](PLANNING.md)** | Phase-by-phase implementation roadmap and scheduled Git milestone commits. |
| **[`TASKS.md`](TASKS.md)** | Granular 54-task board tracking implementation progress across all 10 phases. |

---

## 🚀 Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/Ratul-NotFound/Smart-Escape.git

# Navigate to project directory
cd Smart-Escape

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## 📋 Features & Capabilities

### Core Mandatory Features
- [ ] Ingest and validate building graph schema (`building.json`).
- [ ] Interactive SVG floor map with dynamic auto-scaling `viewBox`.
- [ ] Start location selector (unblocked room or junction).
- [ ] Interactive direct hazard toggling (block/unblock nodes and corridors, close/reopen exits).
- [ ] Offline real-time Dijkstra solver with 3-tier deterministic tie-breaking.
- [ ] Exact official failure messages (`"Starting location blocked"` and `"No route available"`).
- [ ] State Reset button restoring original `initial_state`.
- [ ] Seamless bilingual toggle (English $\longleftrightarrow$ বাংলা).

### Bonus Extensions
- [ ] Animated route walkthrough simulation player.
- [ ] Alternative routes discovery ($K$-shortest paths) with $+\Delta$ cost analysis.
- [ ] High-contrast accessibility theme (WCAG AAA).
- [ ] Client-side PNG map export.
- [ ] Automated Judge Test Runner for Section 4.1 verification cases.

---

## 🧪 Official Test Case Verification Matrix (Section 4.1)

| Test ID | Scenario | Start | Hazard Action | Expected Result | Status |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **TC-1** | Baseline | `R1` | None | `R1 - C1 - C2 - E1; cost 7` | Pending |
| **TC-2** | Blocked junction | `R1` | Block `C2` | `R1 - C1 - C3 - C4 - E2; cost 11` | Pending |
| **TC-3** | Exits closed | `R1` | Close `E1` and `E2` | `No route available` | Pending |
| **TC-4** | Different start | `R2` | None | `R2 - C3 - C4 - E2; cost 7` | Pending |
| **TC-5** | Blocked start | `R1` | Block `R1` | `Starting location blocked` | Pending |

---

## 🤖 AI Tools & Prompt Disclosure

- **AI Tools Used:** Google DeepMind Antigravity AI Coding Assistant
- **Prompts:** Tracked per commit in commit history per Rulebook Section 8.4.
