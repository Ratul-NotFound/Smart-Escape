# TASKS.md — Comprehensive Implementation Task Board

**Project:** Smart Escape — Interactive Emergency Evacuation Route Simulator  
**Contest:** AI DevFest 2026 AI Vibe-Coding Contest (Solo)  
**Total Allocated Time:** 90 Minutes (T+0 to T+90)

---

## Progress Overview

| Phase | Description | Status | Completed / Total |
| :---: | :--- | :---: | :---: |
| **Phase 0** | Governance, Config & Dotfiles | **Completed** | 7 / 7 |
| **Phase 1** | Project Scaffolding & Tooling | **Pending** | 0 / 5 |
| **Phase 2** | Core Domain, Dijkstra Engine & Validator | **Pending** | 0 / 6 |
| **Phase 3** | Reactive Application State & Store | **Pending** | 0 / 4 |
| **Phase 4** | Interactive SVG Floor Map & Canvas | **Pending** | 0 / 6 |
| **Phase 5** | Tactical Route HUD & Status Reporting | **Pending** | 0 / 4 |
| **Phase 6** | Bilingual Localization Engine (EN / BN) | **Pending** | 0 / 3 |
| **Phase 7** | Built-in Judge Automated Test Runner | **Pending** | 0 / 4 |
| **Phase 8** | Winning Bonus Extensions | **Pending** | 0 / 5 |
| **Phase 9** | Quality Assurance, Screenshots & Verification | **Pending** | 0 / 5 |
| **Phase 10**| Release Deliverables & Live Deployment | **Pending** | 0 / 5 |
| **Total** | | | **7 / 54** |

---

## Phase 0: Governance, Config & Dotfiles (Pre-T+0)

- [x] `TASK-001`: Create `.gitignore` excluding raw PDFs, build artifacts, node_modules, and secrets.
- [x] `TASK-002`: Create `.editorconfig` enforcing UTF-8, 2-space indentation, and LF endings.
- [x] `TASK-003`: Create `.gitattributes` establishing automatic LF normalization and binary formats.
- [x] `TASK-004`: Create `.prettierrc` and `.prettierignore` for code formatting consistency.
- [x] `TASK-005`: Create `AGENTS.md` specifying agent directives, contest constraints, and tie-breaking rules.
- [x] `TASK-006`: Create `RULES.md` and `DESIGN.md` establishing system architecture and scoring rubrics.
- [x] `TASK-007`: Initialize Git repository on GitHub and commit setup docs.

---

## Phase 1: Project Scaffolding & Tooling (T+0 to T+10)

- [ ] `TASK-101`: Initialize Vite + React + TypeScript in current directory with minimal overhead.
  - *Files:* `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
  - *Criteria:* Zero bundle bloat, instant HMR, clean scripts (`dev`, `build`, `preview`).
- [ ] `TASK-102`: Set up Lucide React (or lightweight SVG icons) for tactical emergency controls.
- [ ] `TASK-103`: Configure CSS design tokens in `src/index.css` (Tactical Dark EOC theme + High-Contrast mode).
  - *Tokens:* `--bg-primary`, `--bg-surface`, `--accent-route`, `--hazard-red`, `--room-blue`, `--junc-purple`, `--exit-green`.
- [ ] `TASK-104`: Place `building.json` into `public/building.json` and `src/data/defaultBuilding.json` for fallback offline loading.
- [ ] `TASK-105`: Verify project builds cleanly with `npm run build`.

---

## Phase 2: Core Domain, Dijkstra Engine & Validator (T+10 to T+25)
*Target Git Commit #1 Milestone (T+20)*

- [ ] `TASK-201`: Create domain TypeScript type definitions in `src/domain/types.ts`.
  - *Types:* `GraphNode`, `GraphEdge`, `InitialState`, `BuildingData`, `RouteResult`, `RouteStatus`.
- [ ] `TASK-202`: Implement strict JSON schema validator in `src/domain/validator.ts`.
  - *Checks:* Node count (2–60), edge count (1–150), valid types (`room`, `junction`, `exit`), positive integer costs ($w \ge 1$), no self-loops, no duplicate edges, case-sensitive ID matching, initial_state category validity.
- [ ] `TASK-203`: Implement Priority Queue / Min-Heap data structure in `src/domain/priorityQueue.ts`.
- [ ] `TASK-204`: Implement deterministic Dijkstra solver in `src/domain/dijkstra.ts`.
  - *Features:*
    - Active hazard filtering (`blockedNodes`, `blockedEdges`, `closedExits`).
    - Guard clause: If start node is blocked $\to$ return `"Starting location blocked"`.
    - Closed exits cannot be traversed as intermediate or destination nodes.
    - Tier-1 Tie-Break: Minimum cost.
    - Tier-2 Tie-Break: Lexicographically smallest exit ID (`a.exitId < b.exitId`).
    - Tier-3 Tie-Break: Lexicographically smallest node ID sequence.
    - If no open exit reachable $\to$ return `"No route available"`.
- [ ] `TASK-205`: Implement alternative route discovery ($K$-shortest paths / secondary paths) in `src/domain/dijkstra.ts`.
- [ ] `TASK-206`: Write and execute unit verification assertions in `src/domain/dijkstra.test.ts` for all Section 4.1 test cases.
- [ ] **Milestone 1 Commit**: Commit with required prompt format.

---

## Phase 3: Reactive Application State & Store (T+25 to T+35)

- [ ] `TASK-301`: Implement centralized simulation state management in `src/context/SimulationContext.tsx` or lightweight store.
  - *State:* `buildingData`, `startNodeId`, `blockedNodes` (Set), `blockedEdges` (Set), `closedExits` (Set), `routeResult`, `lang` (`'en' | 'bn'`), `theme` (`'dark' | 'high-contrast'`).
- [ ] `TASK-302`: Implement state mutation actions:
  - `setStartNode(nodeId)`
  - `toggleNodeHazard(nodeId)` (block/unblock rooms and junctions)
  - `toggleEdgeHazard(edgeId)` (block/unblock corridors)
  - `toggleExitClosed(exitId)` (close/reopen exits)
  - `resetToInitialState()` (restores JSON `initial_state`)
  - `loadNewBuilding(data)`
- [ ] `TASK-303`: Implement reactive recalculation trigger on every state mutation without re-importing.
- [ ] `TASK-304`: Wire custom JSON file uploader and drag-and-drop parser with user-facing validation errors.

---

## Phase 4: Interactive SVG Floor Map & Canvas (T+35 to T+50)
*Target Git Commit #2 Milestone (T+50)*

- [ ] `TASK-401`: Build dynamic auto-scaling SVG container in `src/components/Map/MapCanvas.tsx`.
  - *Logic:* Auto-calculate `viewBox` using $(\min X - 50, \min Y - 50, \Delta X + 100, \Delta Y + 100)$.
  - *Features:* Smooth pan and zoom controls, reset zoom button.
- [ ] `TASK-402`: Render corridor edges with centered cost badges in `src/components/Map/EdgeRenderer.tsx`.
  - Normal state: Subtle translucent steel cyan.
  - Blocked state: Crimson warning dash-pattern with barrier icon.
  - Active Route state: Highlighted glowing emerald line with animated stroke dash-flow.
  - Interactive click: Toggle corridor blocked/clear state.
- [ ] `TASK-403`: Render nodes by specific geometric shapes in `src/components/Map/NodeRenderer.tsx`.
  - Rooms: Rounded squares (`#3b82f6` Blue).
  - Junctions: Solid circles (`#8b5cf6` Purple).
  - Exits: Hexagonal shields (`#10b981` Emerald when open, `#ef4444` with X when closed).
  - Blocked Nodes: Strikethrough diagonal hazard hatching.
- [ ] `TASK-404`: Render chosen start location with radiant amber badge and pulsating radar rings.
- [ ] `TASK-405`: Add interactive hover cards/tooltips showing node details (ID, label, coordinates, connected edges).
- [ ] `TASK-406`: Implement interaction mode toggle (e.g., "Select Start Location" mode vs. "Toggle Hazards" mode, or direct contextual click).

---

## Phase 5: Tactical Route HUD & Status Reporting (T+50 to T+58)

- [ ] `TASK-501`: Create `src/components/HUD/RouteHUD.tsx` displaying top-level emergency status banner:
  - Success banner: Display sequence (e.g. `R1 - C1 - C2 - E1`), Target Exit (`E1`), and Total Cost (`7`).
  - Starting blocked banner: Exact text `"Starting location blocked"`.
  - Unreachable banner: Exact text `"No route available"`.
- [ ] `TASK-502`: Build interactive node sequence breadcrumb chain showing step-by-step corridor costs.
- [ ] `TASK-503`: Add one-click **"Restore Initial State" (Reset)** button with visual feedback.
- [ ] `TASK-504`: Add quick status summary metrics: Total Nodes, Active Hazards, Open Exits, Path Distance.

---

## Phase 6: Bilingual Localization Engine (EN / BN) (T+58 to T+65)

- [ ] `TASK-601`: Create comprehensive dictionary in `src/i18n/translations.ts` covering English and Bangla:
  - Navigation, titles, control buttons, tooltips, hazard labels, instructions, error dialogues.
  - Ensure exact required failure strings are preserved or mapped per specification.
- [ ] `TASK-602`: Create language switcher toggle component (`src/components/LanguageToggle.tsx`) in header.
- [ ] `TASK-603`: Ensure state remembers selected language in `localStorage` across page refreshes.
- [ ] **Milestone 2 Commit**: Commit with required prompt format.

---

## Phase 7: Built-in Judge Automated Test Suite (T+65 to T+72)

- [ ] `TASK-701`: Create `src/components/Judge/JudgeTestRunner.tsx` test execution engine.
- [ ] `TASK-702`: Encode the 5 official test specifications:
  - TC-1: Baseline $\to$ Start `R1` $\to$ Expected: `R1 - C1 - C2 - E1; cost 7`.
  - TC-2: Blocked Junction $\to$ Start `R1`, Block `C2` $\to$ Expected: `R1 - C1 - C3 - C4 - E2; cost 11`.
  - TC-3: Exits Closed $\to$ Start `R1`, Close `E1` and `E2` $\to$ Expected: `No route available`.
  - TC-4: Different Start $\to$ Start `R2` $\to$ Expected: `R2 - C3 - C4 - E2; cost 7`.
  - TC-5: Blocked Start $\to$ Start `R1`, Block `R1` $\to$ Expected: `Starting location blocked`.
- [ ] `TASK-703`: Add **"Run All Automated Checks"** button with instantaneous live `[PASS]` / `[FAIL]` status badges.
- [ ] `TASK-704`: Allow clicking any test card to instantly inject that state into the active map for live visual inspection.

---

## Phase 8: Premium Bonus Extensions (T+72 to T+80)
*Target Git Commit #3 Milestone (T+78)*

- [ ] `TASK-801`: Build animated **Route Walkthrough Simulation** player:
  - An animated emergency avatar marker traveling node-by-node along the route.
  - Controls: Play, Pause, Step Next, Reset, and Speed Slider (1x, 2x, 4x).
- [ ] `TASK-802`: Build **Alternative Routes Drawer** showing secondary paths with comparative cost delta ($+\Delta$).
- [ ] `TASK-803`: Implement client-side **PNG Map Export** (converts SVG vector canvas to downloadable PNG image).
- [ ] `TASK-804`: Implement **Building State JSON Downloader** (downloads current modified simulation state as valid JSON).
- [ ] `TASK-805`: Implement **High-Contrast Theme Toggle** (WCAG AAA emergency mode).

---

## Phase 9: Quality Assurance, Screenshots & Verification (T+80 to T+85)

- [ ] `TASK-901`: Run full production build (`npm run build`) and fix any TypeScript or bundle warnings.
- [ ] `TASK-902`: Verify offline operation (disconnect network or use Chrome DevTools Offline mode).
- [ ] `TASK-903`: Capture required screenshot 1: `screenshots/baseline_route.png` showing `R1 -> E1; cost 7`.
- [ ] `TASK-904`: Capture required screenshot 2: `screenshots/rerouting_blocked_c2.png` showing `R1 -> E2; cost 11`.
- [ ] `TASK-905`: Test with edge-case custom graphs (disconnected graph, single node, multi-exit ties).

---

## Phase 10: Release Deliverables & Live Deployment (T+85 to T+90)

- [ ] `TASK-1001`: Author production-grade `README.md` containing:
  - Participant Full Name & Registration Number.
  - Public HTTPS Live Website URL.
  - Local installation and run commands.
  - Full inventory of main and bonus features.
  - Automated test suite results table.
  - AI tools used and the most impactful prompt.
- [ ] `TASK-1002`: Verify MIT `LICENSE` file is intact.
- [ ] `TASK-1003`: Deploy web application to public HTTPS (Vercel / Cloudflare Pages / GitHub Pages).
- [ ] `TASK-1004`: Push all final commits to public GitHub repository before T+90.
- [ ] `TASK-1005`: Complete and submit the official submission form before T+90.
