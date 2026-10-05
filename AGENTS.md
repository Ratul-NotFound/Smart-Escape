# AGENTS.md — AI DevFest 2026 Contest Directives & Operational Rules

## 1. Project Identity & Objective
This repository contains **Smart Escape** — an interactive emergency evacuation route simulator built for the **AI DevFest 2026 AI Vibe-Coding Contest (Solo)** organized by the Computer and Programming Club (CPC), Daffodil International University.

All AI agents, coding assistants, and contributors working in this codebase must strictly adhere to the constraints, coding standards, and algorithmic specifications documented below.

---

## 2. Strict Competition Constraints (Zero Violations Allowed)

1. **Frontend-Only Execution (Rulebook Section 5.1):**
   - The entire application must execute purely inside the client web browser.
   - **Strictly Prohibited:** Any participant-controlled backend servers, serverless functions, Firebase, Supabase, Appwrite, or remote persistent databases.
   - **Allowed:** Standard browser native storage (`localStorage`, `sessionStorage`, `IndexedDB`), standard browser APIs, and static hosting.

2. **Zero Secrets & Credentials (Rulebook Section 5.8):**
   - Never commit API keys, tokens, passwords, or personal credentials into git history, source files, or config files.
   - Any optional AI feature must prompt the end user to enter their own API key via an in-app input at runtime.

3. **100% Offline Pathfinding (Rulebook Section 5.4 & Problem Statement Section 3.3):**
   - Evacuation routing and graph calculation must run entirely offline in pure client-side TypeScript/JavaScript without delegating to any external API.

4. **Git Commit Hygiene & Cadence (Rulebook Section 8.3 & 8.4):**
   - Commit at least once every 30 minutes, with a minimum of **three (3) commits in total**.
   - Every commit message must include a concise description of changes **and the AI prompt used** (or `"Manual edit"`). Prompts can be in English or Bangla.
   - Example format:
     ```
     feat: add Dijkstra engine with tie-breaking
     Prompt: "Implement Dijkstra algorithm with strict lexicographical tie-breaking for equal-cost exits and paths"
     ```
   - **Strictly No History Alterations (Rulebook Section 8.5):** No force-pushing (`git push --force`), no rebase on pushed commits, and no deleting/recreating the repository.

5. **Hard Submission Deadlines (Rulebook Section 8.6 & 9.4):**
   - Build, commit, push, and deployment must cease strictly by **T+90**.
   - The late window (T+90 to T+95) is strictly for submitting the form and incurs a **10-mark penalty**. No git commits after T+90 are eligible.

---

## 3. Algorithmic Precision & Routing Rules (Section 3.3)

The graph solver must implement **Dijkstra's Algorithm / Uniform Cost Search** with exact deterministic tie-breaking:

1. **Cost Metric:** Route cost is strictly the sum of corridor edge costs:
   $$\text{Route Cost} = \sum_{e \in P} e.\text{cost}$$
   *Warning:* Display coordinates, Euclidean distance, and corridor hop counts must **never** be used as a substitute for cost.

2. **Exclusions & Hazard Propagation:**
   - **Blocked Rooms / Junctions:** Cannot be entered, traversed, or used as destinations. All incident edges connected to a blocked node are completely disabled.
   - **Blocked Corridors (Edges):** Removes only that specific connection. The connected nodes remain accessible via alternative corridors.
   - **Closed Exits:** Cannot be targeted as destinations and cannot be traversed as intermediate nodes.

3. **Multi-Target Exit Selection & Tie-Breaking Hierarchy:**
   - **Tier 1 (Minimum Cost):** Choose the reachable open exit with minimum total path cost.
   - **Tier 2 (Exit ID Tie-Break):** If multiple reachable open exits have the exact same minimum cost, choose the lexicographically smallest exit ID (e.g., `"E1"` < `"E2"`).
   - **Tier 3 (Path Sequence Tie-Break):** If multiple paths to that same exit tie with identical cost, choose the lexicographically smallest sequence of node IDs (compared element-by-element, e.g. `["R1", "C1", "C2", "E1"]` < `["R1", "C3", "C4", "E1"]`).

4. **Exact Official Status Strings (Mandatory):**
   - If the starting node is blocked:
     $$\mathbf{\text{"Starting location blocked"}}$$
   - If no open exit can be reached from an unblocked start:
     $$\mathbf{\text{"No route available"}}$$
   - When a valid route exists:
     $$\text{Display: } \text{Node Sequence (e.g., } R1 - C1 - C2 - E1\text{), Exit ID, and Total Cost}$$

---

## 4. UI/UX & Interactive Design Directives

1. **Bilingual Support (Mandatory - Section 3.2 & Rulebook 5.6):**
   - Seamless toggle between **English (EN)** and **Bangla (BN)**.
   - All principal labels, buttons, status indicators, error banners, instructions, and test summaries must be localized.
   - Dataset entity labels (e.g., `"Room 101"`) may remain unchanged.

2. **Visual Aesthetics & Accessibility:**
   - Implement an **Emergency Operations Center (EOC) / Tactical Dispatch** aesthetic with deep carbon background and vibrant high-contrast accents.
   - Visual distinction of node types:
     - Rooms: Rounded squares / blue badge (`#3b82f6`).
     - Junctions: Solid circles / violet badge (`#8b5cf6`).
     - Exits: Hexagonal shields / emerald badge (`#10b981` when open, `#ef4444` when closed).
     - Start Location: Radiant amber target with pulsing radar effect (`#f59e0b`).
     - Blocked States: Strikethrough diagonal hazard hatching and warning red badges.
   - SVG Vector Canvas with dynamic auto-scaling `viewBox` computed from coordinate bounds $(\min X, \max X, \min Y, \max Y)$ with comfortable padding.
   - Pan and zoom controls for effortless navigation on any screen size.
   - Subtle, readable CSS/SVG micro-animations (route line dash-flow, pulse rings, smooth hover states). Flashing and jarring animations are forbidden.

---

## 5. Automated Verification & Section 4.1 Sample Checks

Agents must ensure the app passes all 5 official verification cases from Section 4.1 on `building.json`:

| Test ID | Scenario | Action | Expected Output |
| :---: | :--- | :--- | :--- |
| **TC-1** | Baseline | Select `R1` | `R1 - C1 - C2 - E1; cost 7` |
| **TC-2** | Blocked junction | Select `R1`, block `C2` | `R1 - C1 - C3 - C4 - E2; cost 11` |
| **TC-3** | Exits closed | Select `R1`, close `E1` and `E2` | `No route available` |
| **TC-4** | Different start | Select `R2` | `R2 - C3 - C4 - E2; cost 7` |
| **TC-5** | Blocked start | Select `R1`, then block `R1` | `Starting location blocked` |

A built-in **Automated Judge Test Runner** component should be integrated to execute and verify these cases automatically with visual pass/fail badges.

---

## 6. Required Repository Structure & Deliverables

Your repository must strictly include:
- `README.md` containing:
  - Participant full name and registration number.
  - Required public HTTPS live link.
  - Clear local run instructions (`npm install`, `npm run dev`).
  - Implemented main features & bonus features.
  - Known issues (if any).
  - AI tools used and the most useful prompt.
- `LICENSE` containing the full text of the **MIT License**.
- `screenshots/` directory containing:
  - `baseline_route.png` (demonstrating `R1 -> E1; cost 7`).
  - `rerouting_blocked_c2.png` (demonstrating rerouting to `E2; cost 11` after `C2` is blocked).
- Complete, clean, buildable source code.
