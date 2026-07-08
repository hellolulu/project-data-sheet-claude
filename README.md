# Project Data Portal

A role-based **project data sheet** portal — a single-file React prototype modeling a
multi-stage, multi-role approval workflow (MO Secretary → Delegation → Engineer →
QS Team Leader → QS Manager → SIC → PIC → GM → Cost Account → IT). Each persona sees a
different view and set of permissions, and projects advance through an approval chain
until they're issued, with a revision flow for post-submission edits.

🔗 **Live demo:** https://hellolulu.github.io/project-data-sheet-claude/

---

## About

The entire app lives in one self-contained component:
[`ProjectDataPortal_Claude.jsx`](./ProjectDataPortal_Claude.jsx) (~8,000 lines, inline
styles, no UI dependencies beyond React). This repo wraps it in a small **Vite + React**
harness so it can be run, built, and deployed.

## Run locally

Requires **Node 18+**.

```bash
npm install
npm run dev      # start dev server → http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # preview the production build locally
```

> Icons (Tabler Icons) load from a CDN, so an internet connection is required for the
> icon glyphs to render. Everything else works offline.

## Deployment

Pushing to `main` triggers the [GitHub Actions workflow](./.github/workflows/deploy.yml),
which builds the app and publishes it to GitHub Pages. Vite's `base` path auto-detects the
repo name from the `GITHUB_REPOSITORY` environment variable, so assets resolve correctly
both in CI and locally.

---

## End-to-End Test Guide

> The **role switcher** is in the top-right navbar. Use it to switch between personas
> throughout the flows below.

### Flow 1 — Create a brand new project (MO Secretary)

**Switch to: Mary Yip (MO Secretary)**

- On the project list, click **"New Project"** (top-right button — only visible as MO Secretary)
- Fill in: Site Code `2026-RES-TEST`, Full Name, Short Name
- In the Location field, type a search term or click **"Create new location entry"** to open the New Location Modal
- In the modal: select **Lot Type** (e.g. `NKIL`), enter a **Lot No.** — watch the *"Look up address via CSDI"* button appear. Click it — expect a **CORS error** message in the prototype (this is expected and noted)
- Fill in District, Street, paste a Google Maps URL — watch the green validation card appear
- Click **"Create Location"** — it auto-selects in Section A
- Assign **PIC: Wong Siu Fung** and **QS Manager: Ho Yuk Ling**
- Click **"Submit to Delegation"** — you should stay on Section A with a green success banner. The delegation panel below should now show all 5 roles with *"Not yet assigned"* for SIC, Engineer, QS TL

### Flow 2 — Delegate team (PIC + QS Manager)

**Switch to: Wong Siu Fung (PIC)**

- Open the new project from the list — you should land on Section A with identifiers read-only
- In the Team Assignments delegation panel, assign **SIC: Raymond Lam** and **Engineer: Chan Ho Ming**
- Click **"Confirm Assignments"** — banner appears, stays on same screen

**Switch to: Ho Yuk Ling (QS Manager)**

- Open the same project — land on Section A
- Assign **QS Team Leader: Alice Leung**
- Click **"Confirm Assignment"**

### Flow 3 — Engineer data entry (mid-chain existing project)

Use existing project **`2026-COM-KTD`** (Kai Tak Development) — already at engineer stage.

**Switch to: Chan Ho Ming (Engineer)**

- Open **Kai Tak Development Phase 2** from the list
- You should land on the Engineer entry form (Section B+C) with 6 collapsible sections
- Fill in some fields — GFA, Site Area, Nature of Project (radio buttons), select Main Contractor from dropdown
- Note the progress bar updating as you fill mandatory fields
- Click the working notes widget on any field — add a note
- When ready, click **"Submit to QS Team Leader"**

### Flow 4 — Approval chain

**Switch to: Alice Leung (QS Team Leader)**

- Open Kai Tak Development — you should land on the Approval view
- Review the data, click **"Approve"**

**Switch to: Ho Yuk Ling (QS Manager)**

- Open Kai Tak Development — Approval view
- Try a **Clarification Request** on one field before approving
- Then approve

Continue up the chain with **SIC (Raymond Lam) → PIC (Wong Siu Fung) → GM (Henry Lam)**.

### Flow 5 — GM approval + Cost Account (existing project)

Use existing project **`2024-HOT-CWB`** (Causeway Bay Hotel) — already at cost_account stage.

**Switch to: Henry Lam (GM)**

- Open **Sai Kung Waterfront** (`uuid-004`) — at GM stage, approve it

**Switch to: Kevin Tsang (Cost Account)**

- Open **Causeway Bay Boutique Hotel** from the list
- You should see the Cost Account view with Section D — Finance Project Code and Sub-codes
- Fill in the Finance Project Code and add sub-codes
- Click **"Submit to IT"**

### Flow 6 — IT setup

**Switch to: David Chan (IT)**

- Open Causeway Bay Hotel — IT Setup view
- Review the read-only data sheet
- Click **"Confirm Oracle Setup Complete"** — project should move to **Issued** status

### Flow 7 — Revision (existing project)

Use existing project **`2023-RES-TKO`** (Tseung Kwan O) — already in revision status at QS TL stage.

**Switch to: Alice Leung (QS Team Leader)**

- Open **Tseung Kwan O Waterside** — you should see the revision in progress
- Review the diff panel showing what changed
- Approve the revision

### Flow 8 — MO Secretary edits after submission

**Switch to: Mary Yip (MO Secretary)**

- Open any active project (e.g. Wan Wan Terrace `2026-RES-WWT`)
- You should land on Section A — identifiers should be editable
- Change the Short Name, click **"Save Changes"**
- Confirm the banner says *"Changes saved"* and you stay on the same screen

### Quick filter / sort checks (Project List)

- Default view shows **Active Projects only** (Commenced + OP + Not Yet Commenced) — Complete projects hidden
- Change filter to **"Complete"** — should show `STK` and `YLP`
- Click the **Site Commence** column header — should sort ascending/descending with ↑↓ arrows
- Click the **Updated** column header — same sort behaviour
- Collapse the left sidebar — icons should remain visible, tooltips appear on hover

---

## Known limitations

Expected behavior during testing — not bugs:

- **CSDI lot lookup → CORS error** (expected; works in production)
- **Google Maps iframe → blank** (expected; needs API key in production)
- **Working notes don't persist** between role switches (in-memory only)
- **Email notifications are simulated** (no actual emails sent)
