# PLANNING.md — Step-by-Step Implementation Roadmap & Git Milestone Plan

**Project:** Smart Escape — Interactive Emergency Evacuation Simulator  
**Event:** AI DevFest 2026: AI Vibe-Coding Contest (Solo)  
**Time Limit:** 90 Minutes Total (T+0 to T+90)

---

## 1. Contest Execution Timeline & Git Commit Schedule

The Official Rulebook (Section 8.3 & 8.4) mandates:
- **At least 1 commit every 30 minutes.**
- **Minimum 3 commits in total.**
- **Every commit message must contain what changed and the exact AI prompt used (or `"Manual edit"`).**
- **Strictly no changes to Git history after pushing.**

### Milestone Roadmap

```
 T+0                         T+25                         T+55                         T+80            T+90
  │                           │                            │                            │               │
  ▼                           ▼                            ▼                            ▼               ▼
┌──────────────┐            ┌──────────────┐             ┌──────────────┐             ┌──────────────┐ ┌──────┐
│ Environment  │            │ Milestone 1  │             │ Milestone 2  │             │ Milestone 3  │ │Deploy│
│ & Repo Setup │            │ Core Domain  │             │ Interactive  │             │ Polish, Tests│ │& Form│
│              │            │  & Dijkstra  │             │   SVG Map    │             │& Screenshots │ │Submit│
└──────────────┘            └──────────────┘             └──────────────┘             └──────────────┘ └──────┘
                              Commit #1                    Commit #2                    Commit #3
```

---

## 2. Phase-by-Phase Implementation Breakdown

### Phase 0: Pre-Contest Setup & Architecture (Pre-T+0)
- [x] Analyze `AI_DevFest_Vibe_Coding_Rulebook.pdf`, `Smart_Escape_Problem_Statement.pdf`, and `building.json`.
- [x] Generate master guidance and architectural documents:
  - `AGENTS.md` (Operational directives & rules)
  - `RULES.md` (Official rules, timelines, scoring rubrics)
  - `DESIGN.md` (System design, UI tokens, mathematical Dijkstra spec)
  - `PLANNING.md` (Implementation roadmap)
  - `.gitignore` (Production exclusions, secret prevention, PDF exclusion)
- [ ] Initialize Git repository named `devfest-<registration-number>`.
- [ ] Create base `LICENSE` with standard MIT License.

---

### Phase 1: Core Domain Engine, Dijkstra Solver & Validation (T+0 to T+25)
**Goal:** Pure algorithmic foundation with zero visual clutter.

* **Task 1.1: Project Scaffolding:**
  - Initialize high-performance React + TypeScript + Vite project.
  - Zero heavy third-party bundle bloat; fast build, instant hot-reloading.
* **Task 1.2: Graph Data Model & Schema Validator (`src/domain/validator.ts`):**
  - Implement validation against limits: 2–60 nodes, 1–150 edges, valid types (`room`, `junction`, `exit`).
  - Positive integer costs, no self-loops, no duplicate edges, case-sensitive ID tracking.
  - Diagnostic error reporting for corrupted files.
* **Task 1.3: Multi-Target Dijkstra Engine with Tie-Breaking (`src/domain/dijkstra.ts`):**
  - Implement Min-Priority Queue Dijkstra.
  - Strict pruning of active hazards (`blockedNodes`, `blockedEdges`, `closedExits`).
  - Implement Tier-1 (Cost), Tier-2 (Exit ID), and Tier-3 (Node Sequence) deterministic tie-breaking.
  - Exact status handling: `"Starting location blocked"` and `"No route available"`.
* **Task 1.4: Pure Logic Unit Tests:**
  - Automated test assertions verifying all Section 4.1 test cases.
* **Milestone 1 Git Commit (Target: T+20):**
  ```bash
  git commit -m "feat: core graph domain, Dijkstra engine with tie-breaking, and schema validator
  Prompt: 'Implement Dijkstra routing algorithm in TypeScript with strict three-tier lexicographical tie-breaking, hazard exclusion, and JSON schema validation'"
  ```

---

### Phase 2: Interactive SVG Floor Map & Tactical HUD (T+25 to T+55)
**Goal:** High-impact visual canvas and real-time hazard manipulation.

* **Task 2.1: Dynamic Auto-Scaling SVG Viewport (`src/components/MapCanvas.tsx`):**
  - Compute dynamic bounding box $(\min X, \max X, \min Y, \max Y) + \text{padding}$.
  - Support smooth zoom in/out, pan, and center reset.
* **Task 2.2: Node & Corridor Rendering:**
  - Nodes: Styled by type (Rooms = rounded blue squares, Junctions = purple circles, Exits = emerald/crimson shields).
  - Corridors: Undirected lines with visible cost badges centered along the edge midpoint.
  - Selected Start Node: Radiant amber beacon with pulsing radar ring.
* **Task 2.3: Interactive Direct Manipulation:**
  - Click node: Toggle start location or toggle hazard.
  - Click edge: Toggle corridor blockage.
  - Tooltips displaying node ID, label, coordinates, and connected edges.
* **Task 2.4: Real-Time Route HUD (`src/components/RouteHUD.tsx`):**
  - Instant display of node sequence (e.g., `R1 - C1 - C2 - E1`), destination exit, and total cost.
  - Alert banners for `"Starting location blocked"` and `"No route available"`.
  - State Reset button restoring original `initial_state`.
* **Milestone 2 Git Commit (Target: T+50):**
  ```bash
  git commit -m "feat: interactive SVG building map, real-time hazard toggling, and route HUD
  Prompt: 'Create interactive SVG map canvas with auto-scaling viewBox, click-to-block hazard controls, visual cost badges, and real-time evacuation route HUD'"
  ```

---

### Phase 3: Bilingual Support, Judge Test Suite & Bonus Features (T+55 to T+80)
**Goal:** Flawless compliance, automated proof of correctness, and winning features.

* **Task 3.1: Bilingual Localization Engine (`src/i18n/`):**
  - Instant English (EN) $\longleftrightarrow$ বাংলা (BN) toggle in top navigation.
  - 100% UI translation coverage while preserving required exact status strings.
* **Task 3.2: Built-in Judge Automated Test Suite (`src/components/JudgeTestRunner.tsx`):**
  - One-click panel executing all 5 Section 4.1 test cases against `building.json`.
  - Displays Expected vs. Actual results with clear green `[PASS]` badges.
  - Click any test card to instantly apply the scenario to the interactive map.
* **Task 3.3: Route Walkthrough Simulation Player (Section 4.2 Extension):**
  - Animated emergency avatar traversing node-by-node along the evacuation route.
  - Play, Pause, Step-Forward, and Speed adjustment slider.
* **Task 3.4: Alternative Routes Drawer (Section 4.2 Extension):**
  - Computes and displays the 2nd best route with comparative $+\Delta$ cost.
* **Task 3.5: Client-Side PNG Export & JSON State Downloader:**
  - Export snapshot of current building evacuation map as high-res PNG.
  - Download modified building state as valid JSON.
* **Task 3.6: High-Contrast Accessibility Mode:**
  - WCAG AAA ultra-contrast mode toggle for low-visibility emergency scenarios.
* **Milestone 3 Git Commit (Target: T+75):**
  ```bash
  git commit -m "feat: bilingual support, Judge test suite runner, walkthrough animation, and PNG export
  Prompt: 'Implement English/Bangla language switcher, Section 4.1 automated test runner, animated route walker, and client-side PNG export'"
  ```

---

### Phase 4: Production Build, Screenshots & Deployment (T+80 to T+90)
**Goal:** Meet all mandatory deliverables and deploy to public HTTPS before T+90.

* **Task 4.1: Production Build Verification:**
  - Run `npm run build` to verify zero TypeScript errors and zero bundler warnings.
  - Test production bundle locally with `npm run preview`.
* **Task 4.2: Capture Mandatory Screenshots:**
  - Generate and save into `screenshots/`:
    1. `screenshots/baseline_route.png` (Baseline: `R1` to `E1`, cost 7).
    2. `screenshots/rerouting_blocked_c2.png` (Blocked C2: reroutes to `E2`, cost 11).
* **Task 4.3: Author Comprehensive `README.md`:**
  - Full Name & Registration Number.
  - Public HTTPS Live URL.
  - Local setup & run instructions (`npm install`, `npm run dev`).
  - Feature inventory (Main + Bonus extensions).
  - Official test case verification report.
  - AI tools used and most useful prompt.
* **Task 4.4: Deploy to Public HTTPS:**
  - Deploy to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
  - Verify live website opens cleanly on Chrome without login or console errors.
* **Final Eligible Commit (Must be pushed before T+90):**
  ```bash
  git commit -m "chore: final production release with README, screenshots, and deployment configuration
  Prompt: 'Prepare final release deliverables including comprehensive README documentation, verification screenshots, and production deployment configuration'"
  ```

---

### Phase 5: Submission Window (T+90 to T+95)
* Submit the official contest form with:
  1. Full Name
  2. Registration Number
  3. Public GitHub Repository Link (`https://github.com/.../devfest-<reg-no>`)
  4. Final Commit Hash (Full or first 7 characters)
  5. Public HTTPS Live Website Link
