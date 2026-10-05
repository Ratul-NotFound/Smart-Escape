# RULES.md — Official Contest Rules, Timelines & Compliance Matrix

This document provides a consolidated, unambiguous reference for all operational rules, scoring criteria, and technical constraints for **AI DevFest 2026: AI Vibe-Coding Contest (Solo)**.

---

## 1. Contest Identity & Schedule

| Field | Detail |
| :--- | :--- |
| **Contest** | AI DevFest 2026: AI Vibe-Coding Contest (Solo) |
| **Organizer** | Computer and Programming Club (CPC), CSE Dept, Daffodil International University |
| **Supported By** | Center for Software Development & Emerging Tech (CSE-TECH) |
| **Format** | Solo (One person, strictly no teams) |
| **Date** | 6 October 2026 |
| **Contest Time** | 3:30 PM to 5:30 PM |
| **Results Announced** | 7 October 2026 at 2:00 PM |

### Official Timeline Breakdown

```
[ Setup Phase: 30 Mins ] ── (Login to GitHub & AI tools; create repo; verify push; no project code)
            │
            ▼ T+0 (Contest Officially Starts)
[ Questions Window: T+0 to T+15 ] ── (First 15 minutes to ask organizers clarifying questions)
            │
            ▼
[ Build, Commit & Deploy: T+0 to T+90 ] ── (90 minutes total build and deployment time)
            │
            ▼ T+90 (HARD DEADLINE)
[ Stop Coding & Deploying: T+90 ] ── (All code, commits, pushes, and deployment changes MUST STOP)
            │
            ▼
[ Late Submission Window: T+90 to T+95 ] ── (Form submission ONLY; -10 marks penalty applies)
            │
            ▼ > T+95 (Submissions Closed)
```

---

## 2. Technical Rules (Rulebook Section 5)

* **5.1 Frontend Only:** The entire web app must run purely in the web browser.
  * *Prohibited:* Participant-controlled backend servers, Node/Express/Python servers, serverless functions (Vercel Serverless, AWS Lambda), or persistent remote storage/databases (Firebase, Supabase, Appwrite).
  * *Allowed:* Browser storage (`localStorage`, `sessionStorage`, `IndexedDB`), standard browser APIs, static web hosting, and external HTTPS CORS APIs under Section 5.4.
* **5.2 Framework Choice:** Any framework (React, Vue, Svelte, Vite, Vanilla JS/HTML/CSS) is permitted. Official starter tools like `create-vite` and npm packages are permitted.
* **5.3 Start from Zero:** All code must be created during the contest in a newly initialized repository. No pre-written templates or old project code.
* **5.4 External APIs:** Allowed only if public/HTTPS/CORS and non-persistent. However, **the core routing algorithm must work 100% offline without external network calls**.
* **5.5 In-App AI (Optional):** Main features must fully function without AI. If AI features are included, the user must input their own API key at runtime. Never embed an API key in code or repository.
* **5.6 Bilingual Support:** Must support both **Bangla** and **English** (e.g., via a header language toggle). All main labels, buttons, error messages, and instructions must be available in both languages.
* **5.7 Live HTTPS Deployment:** Compulsory public HTTPS deployment live by T+90 (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Must work in Google Chrome without installation or authentication.
* **5.8 Zero Secrets:** Never commit passwords, tokens, API keys, or private credentials into Git history or code.

---

## 3. GitHub & Commit Directives (Rulebook Section 8)

* **Repository Naming:** Must be named `devfest-<registration-number>`.
* **Public Visibility:** The repository must be public so judges can inspect the source code and commit history.
* **Commit Cadence:** At least **one commit every 30 minutes**, with a **minimum of 3 commits** in total.
* **Commit Message Standard:**
  Every commit message must state what changed and include the exact AI prompt used, or `"Manual edit"`.
  * *Valid Example 1:*
    ```
    feat: implement Dijkstra routing engine with tie-breaking
    Prompt: "Write a client-side Dijkstra algorithm that finds the shortest path to an exit with lexicographical tie-breaking"
    ```
  * *Valid Example 2:*
    ```
    fix: adjust exit badge color and padding
    Manual edit
    ```
* **No Git History Rewriting:** Strictly no force-pushing (`git push -f`), rebasing pushed commits, or deleting the repository.

---

## 4. Problem Functional Requirements: Smart Escape

* **Input Data:** Ingestion and validation of building graph JSON (`building.json` format).
* **Graph Rendering:** Render all nodes (`room`, `junction`, `exit`) at provided $(x, y)$ display coordinates with readable labels, distinct visual styles, and visible corridor costs.
* **Start Node Selection:** User can select any unblocked room or junction as the starting point.
* **Dynamic Hazard Toggling:**
  * Block/unblock rooms and junctions.
  * Block/unblock corridors (edges).
  * Close/reopen exits.
  * Visual states must clearly differentiate normal vs. hazard states.
* **Reactive Recalculation:** Route recomputed instantaneously upon any hazard or start selection change, without re-importing the file.
* **State Reset:** Reset button that cleanly restores the file's original `initial_state`.
* **Exact Status Reporting:**
  * If start node is blocked: `"Starting location blocked"`
  * If no exit is reachable: `"No route available"`
  * If route exists: Show node sequence (e.g., `R1 - C1 - C2 - E1`), exit ID, and total route cost.

---

## 5. Official Test Cases (Problem Statement Section 4.1)

Using `building.json`, all test cases must yield exact outputs:

| Scenario | Action | Expected Output |
| :--- | :--- | :--- |
| **Baseline** | Select `R1` | `R1 - C1 - C2 - E1; cost 7` |
| **Blocked junction** | Select `R1`; block `C2` | `R1 - C1 - C3 - C4 - E2; cost 11` |
| **Exits closed** | Select `R1`; close `E1` and `E2` | `No route available` |
| **Different start** | Select `R2` | `R2 - C3 - C4 - E2; cost 7` |
| **Blocked start** | Select `R1`; then block `R1` | `Starting location blocked` |

---

## 6. Deliverables Checklist (Rulebook Section 9 & 10)

Before T+90, ensure the following are submitted and deployed:

- [ ] **Public GitHub Repository:** `devfest-<registration-number>`
- [ ] **Public HTTPS Live URL:** Hosted on Vercel / Netlify / Cloudflare Pages / GitHub Pages
- [ ] **All Source Code:** Clean, buildable, frontend-only TypeScript/JavaScript
- [ ] **README.md:** Containing:
  - Full Name & Registration Number
  - Live HTTPS URL
  - How to run locally (`npm install`, `npm run dev`)
  - Main features completed
  - Bonus features completed
  - Known issues (if any)
  - AI tools used & most useful prompt
- [ ] **LICENSE:** Standard MIT License
- [ ] **screenshots/ Directory:**
  - `screenshots/baseline_route.png`
  - `screenshots/rerouting_blocked_c2.png`
- [ ] **Official Submission Form:** Submitted before T+90 with Name, Reg No, Repo URL, Final Commit Hash, and Live Link.
