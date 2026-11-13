# BChecker (Next.js rebuild) - design (rev 3: real-score model, wider catalogue and options)

Date: 2026-11-13. Status: awaiting approval. Supersedes rev 1 (48-row lookup table) and rev 2. The plan in `docs/superpowers/plans/` is outdated until rewritten after approval of this revision.

**Honesty line (applies throughout):** only CPUs and GPUs carry real published scores. Everything else (workload shares for extra purposes, refresh-rate effect, RAM advisories) is a transparent heuristic or a rule-based advisory, labelled as such on the page. Heuristics are never presented as data.

## Intent and why
Rebuild the Laravel + plain-PHP BChecker as a Next.js app with a gaming-style frontend, and replace its hand-entered result table with an **estimate computed from published benchmark scores** for a larger set of parts. It is a **portfolio piece**: a point of view, correct behaviour, transparent method, easy to run.

## What it does
The user picks a CPU, GPU, resolution and purpose (General / Gaming). The app computes how much of the stronger part is being held back, which part is the limit, and shows a bottleneck percentage and status (Balanced / Upgrade CPU / Upgrade GPU) with the inputs and formula visible.

## Goals
- Next.js (App Router), TypeScript, Tailwind; no database; deploys to Vercel as-is.
- **About 30 CPUs and 30 GPUs** (Intel and AMD CPUs across recent generations, entry to flagship; NVIDIA and AMD GPUs, plus Intel Arc if its scores can be read), each with a real published score, source name, source URL and capture date. The original parts (i3-13100, i5-13400, i7-13700, i9-13900; RTX 3050, 3070, 3090) stay in the set. Count is a target, not a promise: a part whose score cannot be read from its cited page is dropped. The catalogue is one data file, so more parts can be added later without code changes.
- **Options:**
  - Resolution: HD, FHD, QHD, 4K.
  - Purpose (6): General, Gaming, Competitive/Esports, Streaming while gaming, Video editing, 3D rendering.
  - Target refresh rate (optional): 60, 120/144, 240 Hz; affects Gaming, Competitive and Streaming only. Unset = 60.
  - RAM capacity (optional): 8, 16, 32, 64 GB; produces advisories only, never changes the percentage.
- Resolution and refresh rate now change results where relevant.
- Frontend direction **A, "Loadout HUD"** (dark game-UI, slot cards with a mini score bar, health-bar gauge result, one acid-green accent).
- Accessible (keyboard, screen reader, `prefers-reduced-motion`), usable at 360px.
- Tested model and data; README with screenshot, method, data sources and limits.

## Non-goals
- No scraping or bulk copying of any benchmark site; no live data; no database, accounts or admin pages.
- No per-game FPS data. No claim of exact accuracy. No edits to the old Laravel project.
- RAM, storage, PSU, cooling and motherboard do not change the bottleneck percentage; only RAM capacity gets advisories. No laptop/mobile parts in this version.
- The old 48 hand-entered rows are retired; results will not match the old app, and that is expected.

## Anti-goals
- Any score typed from memory or guessed: every number must be read from its cited page.
- Presenting the estimate as measured fact.
- Generic "AI template" look; a pretty page that is not keyboard-usable.

## Approaches considered
- **Look:** A Loadout HUD (chosen by the user).
- **Data source:** A hand-typed published scores, B Blender Open Data (CC0, rendering-only, poor fit for Gaming), **C a mix (chosen by the user)**: a single consistent published index for CPUs and one for GPUs, read by hand (~24 values), cited on the page. If the source's terms forbid this, stop and ask the user (fallback: fewer parts, or Blender data for the General purpose only).
- **Model:** (1) normalized score ratio only; (2) **workload-share model (chosen)**; (3) per-game FPS lookup (rejected: needs data we cannot legally or reliably get).
- **Build:** typed data + pure functions + route handler + Vitest (unchanged from rev 1).

## Model (the calculation)
Each part has a published score: `C` (CPU), `G` (GPU). The workload splits into a GPU share `s` and a CPU share `1 - s`, set by purpose and resolution (calls of mine, labelled heuristic on the page):

| Purpose | HD | FHD | QHD | 4K |
|---|---|---|---|---|
| General | 0.25 | 0.25 | 0.25 | 0.25 |
| Gaming | 0.45 | 0.55 | 0.65 | 0.75 |
| Competitive/Esports | 0.30 | 0.35 | 0.45 | 0.55 |
| Streaming while gaming | 0.35 | 0.40 | 0.50 | 0.60 |
| Video editing | 0.50 | 0.50 | 0.50 | 0.50 |
| 3D rendering | 0.80 | 0.80 | 0.80 | 0.80 |

Refresh-rate adjustment (Gaming, Competitive, Streaming only): GPU share `s` is reduced by 0 at 60 Hz, 0.05 at 120/144 Hz, 0.10 at 240 Hz (higher frame rates load the CPU more). `s` is clamped to `[0.10, 0.90]`. All shares and adjustments are my heuristic calls and are shown on the page as such.

RAM advisories (rule-based, shown beside the result, never in the percentage): Gaming/Competitive/Streaming with < 16 GB; Video editing or 3D rendering with < 32 GB; 4K with < 32 GB. Each advisory cites the rule in plain words ("16 GB is the commonly recommended minimum for modern games"). No advisory when RAM is unset.

- `cpuPower = (C / C_ref) / (1 - s)`, `gpuPower = (G / G_ref) / s`.
- Delivered performance is the lower of the two. `bottleneck % = (1 - min / max) * 100`, rounded to 2 decimals.
- Limiting part = the part with the lower power (CPU or GPU). Status: `Balanced` when `bottleneck <= 10`; otherwise `Upgrade CPU` if the CPU is limiting, `Upgrade GPU` if the GPU is.
- Calibration: `C_ref` and `G_ref` are chosen so that **i5-13400 + RTX 3070 at Gaming FHD gives about 0%**. The builder derives them from the collected scores and records the derivation in the code and README.
- Gauge colour (display only): `<= 15` green, `15 < x <= 30` amber, `> 30` red.

## Data
- `src/data/parts.ts`: `Cpu` and `Gpu` records: `id`, `name`, `vendor`, `score`, `source` (name), `sourceUrl`, `capturedOn` (ISO date). Final part list is the builder's call within the goals above; chosen for recognisability and spread of performance.
- **Collection step (before coding the model):** open each part's public page in the browser, read the score, record it with URL and date. First read the source's terms; if they forbid even manual citation, stop and ask the user. Never fill a number from memory; if a page cannot be read, drop the part.

## Design
- `src/lib/model.ts` - pure `estimate(cpu, gpu, resolution, purpose)`; `src/lib/lookup.ts` - validates ids and calls the model.
- `src/app/api/bottleneck/route.ts` - POST `{ cpuId, gpuId, resolutionId, purposeId }` -> 200 `{ bottleneck, limiting: "CPU" | "GPU" | "none", note, cpuScore, gpuScore }`; 400 invalid input; 404 unknown id.
- UI: with ~30 parts per side, CPU and GPU use a **searchable picker** (filter box + vendor chips + a scrollable radio list of slot cards, each with a mini score bar; real radio inputs so keyboard and screen readers work); resolution segmented control (4); purpose as a 6-option toggle grid; optional refresh-rate and RAM selectors in a collapsible "Advanced" panel; `ANALYZE` disabled until CPU, GPU, resolution and purpose are chosen; result gauge + status tag + a "how this was calculated" readout showing the scores, shares and result; clear empty, loading, error states.
- Sections: How it works (the model in plain words), About the data (sources table with links and dates, limits: single scores are an approximation, not measured FPS).

## Verification
- Vitest: refresh rate never raises the GPU share; shares clamp to [0.10, 0.90]; RAM advisory rules fire exactly at their thresholds and never change `bottleneck`; every purpose/resolution pair has a share; part ids are unique; the picker filter (by name and vendor) returns expected parts.
- Vitest: model sanity (equal-calibrated pair ~0% at Gaming FHD; faster GPU alone never reduces the GPU's power; for Gaming, higher resolution never lowers GPU-limited bottleneck for a GPU-limited pair; the CPU/GPU labelling is correct for an obviously lopsided pair, e.g. i3-13100 + RTX 3090 is CPU-limited, i9-13900 + RTX 3050 is GPU-limited); every part has source, URL and date; lookup validation cases; route status codes.
- Browser check at 360 / 768 / 1280 px, keyboard-only run-through, reduced-motion check, `next build` clean.

## Calls the builder owns (settled by me, not the user)
- Location: `C:\Users\riski\Downloads\Desktop\coding\project\bchecker-next`.
- Which two published indices are used (one CPU, one GPU), the exact part list, fonts (Chakra Petch, JetBrains Mono), accent hex, workload shares and the 10% balanced threshold, component split, Vitest, npm.
