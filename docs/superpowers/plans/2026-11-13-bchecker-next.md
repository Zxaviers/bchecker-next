# BChecker Next.js Rebuild Implementation Plan (rev 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build BChecker as a Next.js app with the "Loadout HUD" frontend that estimates CPU/GPU bottlenecks from cited real benchmark scores (about 30 CPUs, 30 GPUs), six purposes, four resolutions, and optional refresh-rate and RAM options.

**Architecture:** Typed catalogue (`parts.ts`) + option tables (`options.ts`) -> pure `estimate()` model with calibration -> `lookup()` validation -> `POST /api/bottleneck` -> client UI (searchable pickers, segmented controls, ANALYZE, gauge result with calculation readout and advisories).

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind, `next/font` (Chakra Petch, JetBrains Mono), Vitest, npm.

**Spec:** `docs/superpowers/specs/2026-11-13-bchecker-next-design.md` (rev 3)

## Global Constraints

- Project folder: the repository root (`bchecker-next`). The old Laravel project is never modified.
- **Every CPU/GPU score is read from its cited page and recorded with `source`, `sourceUrl`, `capturedOn` (ISO date). Never typed from memory; a part whose page can't be read is dropped.** If a source's terms forbid manual citation, stop and ask the user.
- No scraping or bulk download; no database, auth, or admin pages; no per-game FPS data.
- Only CPU and GPU scores are data. Shares, refresh adjustments, RAM advisories are heuristics and labelled as such on the page.
- Ids: resolution `"hd" | "fhd" | "qhd" | "4k"`; purpose `"general" | "gaming" | "esports" | "streaming" | "video" | "render"`; refresh `60 | 120 | 144 | 240`; RAM `8 | 16 | 32 | 64`.
- Workload GPU shares (exact): general 0.25 all resolutions; gaming 0.45/0.55/0.65/0.75; esports 0.30/0.35/0.45/0.55; streaming 0.35/0.40/0.50/0.60; video 0.50 all; render 0.80 all (order hd/fhd/qhd/4k). Refresh reduces share by 0 (60), 0.05 (120/144), 0.10 (240), only for gaming/esports/streaming. Clamp to `[0.10, 0.90]`.
- Formula: `cpuPower = (C/Cref)/(1-s)`, `gpuPower = (G/Gref)/s`; `bottleneck = round((1 - min/max)*100, 2)`; balanced when `<= 10`. Gauge severity: `<= 15` low, `<= 30` mid, else high (display only).
- Calibration: `Cref = score(i5-13400)`, `Gref = score(RTX 3070) * 0.45/0.55`, so i5-13400 + RTX 3070 at gaming/FHD/60 Hz is ~0%.
- Palette: near-black bg, one acid-green accent, amber/red for warnings only. No purple gradients, no glassmorphism. Fonts: Chakra Petch (headings), JetBrains Mono (readouts).
- Keyboard + screen-reader usable; honour `prefers-reduced-motion`; usable at 360px; nothing preselected; ANALYZE disabled until CPU, GPU, resolution, purpose are chosen.
- npm only. Commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- Optional `refreshHz`/`ramGb` absent or `null` -> valid; invalid values (75 Hz, 12 GB) -> 400, never a 500.
- Non-JSON/empty body, wrong types, a GPU id passed as `cpuId` -> typed 400/404 errors.
- Refresh rate on general/video/render purposes has no effect on the result.
- Weakest CPU + strongest GPU (and the reverse) gives a percentage `< 100`, labelled with the correct limiting part.
- Double-clicking ANALYZE or changing any selection mid-request: stale response must not overwrite state; any selection change clears the old result.
- Picker filter with no matches shows an empty state; a selected part stays selected when filtered out of view; selecting via keyboard works.
- A `~0` result shows an empty gauge with BALANCED and limiting "none"; network failure shows an error with Retry.

---

### Task 1: Scaffold, tooling, repo

**Files:**
- Create: project via `create-next-app` in `bchecker-next` (TypeScript, Tailwind, App Router, `src/` dir, ESLint); `vitest.config.ts`
- Modify: `package.json` (`"test": "vitest run"`)

**Interfaces:**
- Produces: `npm test` runs Vitest with `@/` -> `src/` alias; `npm run dev|build|lint` work.

- [ ] **Step 1:** Run `create-next-app` into the existing folder (keep `docs/`); ensure a git repo exists; first commit includes `docs/`.
- [ ] **Step 2:** Install `vitest`, `vite-tsconfig-paths`; write `vitest.config.ts` (paths plugin, `environment: "node"`, include `src/**/*.test.ts`).
- [ ] **Step 3:** Add a throwaway `src/lib/smoke.test.ts` (`expect(1).toBe(1)`), run `npm test` -> PASS, delete it.
- [ ] **Step 4:** Run `npm run build`. Expected: succeeds.
- [ ] **Step 5:** Commit `chore: scaffold next app with vitest`.

### Task 2: Source terms check and score catalogue

**Files:**
- Create: `src/data/parts.ts`, `docs/data-sources.md` (terms notes + method)
- Test: `src/data/parts.test.ts`

**Interfaces:**
- Produces (`src/data/parts.ts`):
  - `interface Part { id: string; name: string; vendor: string; score: number; source: string; sourceUrl: string; capturedOn: string }`
  - `export type CpuVendor = "Intel" | "AMD"`, `GpuVendor = "NVIDIA" | "AMD" | "Intel"`; `interface Cpu extends Part { vendor: CpuVendor }`, `interface Gpu extends Part { vendor: GpuVendor }`
  - `export const CPUS: Cpu[]`, `export const GPUS: Gpu[]` (ids are kebab-case slugs, e.g. `"intel-core-i5-13400"`, `"nvidia-geforce-rtx-3070"`)

- [ ] **Step 1: Terms check.** Open the chosen benchmark sites' terms pages in the browser (default candidates: PassMark CPU Mark for CPUs, G3D Mark for GPUs; pick one consistent index per component). Record in `docs/data-sources.md` what the terms say about copying/citing. If manual citation of individual scores is not permitted, STOP and ask the user (fallbacks: fewer parts, or a different source).
- [ ] **Step 2: Write failing tests** in `parts.test.ts`: every part has non-empty `id/name/source`, `sourceUrl` starting with `https://`, `capturedOn` matching `^\d{4}-\d{2}-\d{2}$`, numeric `score > 0`; ids unique across each list; at least 20 CPUs and 20 GPUs; the seven original parts exist by id (`intel-core-i3-13100`, `intel-core-i5-13400`, `intel-core-i7-13700`, `intel-core-i9-13900`, `nvidia-geforce-rtx-3050`, `nvidia-geforce-rtx-3070`, `nvidia-geforce-rtx-3090`); at least two CPU vendors and two GPU vendors present.
- [ ] **Step 3:** Run `npm test` -> FAIL.
- [ ] **Step 4: Collect.** Target ~30 CPUs and ~30 GPUs spanning entry to flagship (Intel 12th-14th gen, AMD Ryzen 5000/7000/9000; NVIDIA RTX 20/30/40/50, AMD RX 6000/7000/9000, Intel Arc where readable). For each, open the part's public page in the browser, read the score, record it exactly as shown with URL and today's date in `parts.ts`. CPU and GPU collection may be done by parallel subagents; each reports parts it could not read (dropped, listed in `docs/data-sources.md`).
- [ ] **Step 5: Re-verify.** Independently re-open 5 random CPU and 5 random GPU entries and confirm the recorded score matches the page. Run `npm test` -> PASS.
- [ ] **Step 6:** Commit `feat: cited benchmark score catalogue`.

### Task 3: Options and model

**Files:**
- Create: `src/data/options.ts`, `src/lib/model.ts`, `src/lib/calibration.ts`
- Test: `src/lib/model.test.ts`

**Interfaces:**
- Consumes: `Cpu`, `Gpu`, `CPUS`, `GPUS` from `@/data/parts`.
- Produces (`options.ts`): `type ResolutionId`, `PurposeId`, `RefreshHz`, `RamGb` (unions from Global Constraints); `RESOLUTIONS: {id: ResolutionId; label: string; width: number; height: number}[]`; `PURPOSES: {id: PurposeId; label: string}[]` (labels: General, Gaming, Competitive / Esports, Streaming while gaming, Video editing, 3D rendering); `REFRESH_RATES: RefreshHz[]`; `RAM_SIZES: RamGb[]`; `GPU_SHARE: Record<PurposeId, Record<ResolutionId, number>>`.
- Produces (`calibration.ts`): `export const C_REF: number`, `export const G_REF: number` computed from `CPUS`/`GPUS` per Global Constraints (throws at import if the two reference parts are missing).
- Produces (`model.ts`):
  - `export function gpuShare(purpose: PurposeId, resolution: ResolutionId, refreshHz?: RefreshHz | null): number`
  - `type Status = "Balanced" | "Upgrade CPU" | "Upgrade GPU"`
  - `interface Estimate { bottleneck: number; limiting: "CPU" | "GPU" | "none"; note: Status; gpuShare: number; cpuPower: number; gpuPower: number }`
  - `export function estimate(i: { cpu: Cpu; gpu: Gpu; resolution: ResolutionId; purpose: PurposeId; refreshHz?: RefreshHz | null }): Estimate` (`limiting` is `"none"` when balanced).

- [ ] **Step 1: Write failing tests.** `gpuShare("gaming","fhd")` = 0.55; `("gaming","4k",240)` = 0.65; `("esports","hd",240)` = 0.20; `("render","hd",240)` = 0.80 (refresh ignored); `("esports","hd",240)` never below 0.10 and a contrived clamp check at 0.10/0.90; every purpose x resolution pair is defined. `estimate` with i5-13400 + RTX 3070, gaming/fhd -> `|bottleneck| < 0.5`, note `Balanced`, limiting `none`; i3-13100 + RTX 3090, gaming/fhd -> limiting `CPU`, note `Upgrade CPU`, bottleneck > 30; i9-13900 + RTX 3050, gaming/fhd -> limiting `GPU`, note `Upgrade GPU`; for a GPU-limited pair, raising resolution (hd -> 4k, gaming) never lowers the bottleneck; weakest catalogue CPU + strongest catalogue GPU (and reverse) -> `0 <= bottleneck < 100`; refresh 240 vs 60 never decreases the CPU-limited bottleneck for an esports pair that is CPU-limited.
- [ ] **Step 2:** Run `npm test` -> FAIL.
- [ ] **Step 3:** Implement `options.ts`, `calibration.ts`, `model.ts` per the formula in Global Constraints.
- [ ] **Step 4:** Run `npm test` -> PASS. **Step 5:** Commit `feat: workload-share bottleneck model`.

### Task 4: Lookup, RAM advisories, API route, severity

**Files:**
- Create: `src/lib/lookup.ts`, `src/lib/advisories.ts`, `src/lib/severity.ts`, `src/app/api/bottleneck/route.ts`
- Test: `src/lib/lookup.test.ts`, `src/lib/advisories.test.ts`, `src/lib/severity.test.ts`, `src/app/api/bottleneck/route.test.ts`

**Interfaces:**
- Consumes: `estimate`, `Estimate`, `CPUS`, `GPUS`, option types.
- Produces: `interface Advisory { id: "ram-gaming-16" | "ram-pro-32" | "ram-4k-32"; message: string }`; `export function ramAdvisories(purpose: PurposeId, resolution: ResolutionId, ramGb?: RamGb | null): Advisory[]` (rules: gaming/esports/streaming with `< 16`; video/render with `< 32`; resolution `4k` with `< 32`; none when `ramGb` unset; never mutates the percentage).
- Produces: `type LookupResult = { ok: true; cpu: Cpu; gpu: Gpu; estimate: Estimate; advisories: Advisory[] } | { ok: false; error: "invalid_input" | "not_found" }`; `export function lookup(input: unknown): LookupResult` (body shape `{cpuId, gpuId, resolutionId, purposeId, refreshHz?, ramGb?}`; non-object, wrong types, enum values outside the unions -> `invalid_input`; unknown cpu/gpu id -> `not_found`; `refreshHz`/`ramGb` may be absent or `null`).
- Produces: `export type Severity = "low" | "mid" | "high"`; `export function severity(percent: number): Severity` (15 -> low, 15.01 -> mid, 30 -> mid, 30.01 -> high).
- Produces: `POST /api/bottleneck`: 200 `{ cpuName, gpuName, cpuScore, gpuScore, bottleneck, limiting, note, gpuShare, cpuPower, gpuPower, advisories }`; 400 `{ error: "invalid_input" }` (including unparseable/empty body); 404 `{ error: "not_found" }`. `export async function POST(request: Request): Promise<Response>`.

- [ ] **Step 1: Write failing tests** for: `ramAdvisories` at each threshold (gaming 8 -> `ram-gaming-16`; gaming 16 -> none; render 16 -> `ram-pro-32`; 4k gaming 16 -> `ram-4k-32`; gaming 8 at 4k -> both; unset -> `[]`); `severity` boundaries above; `lookup` happy path with slugs from Task 2, absent and `null` optionals, `refreshHz: 75` and `ramGb: 12` -> `invalid_input`, `cpuId` set to a GPU id -> `not_found`, non-object input -> `invalid_input`; route: 200 shape, 400 for `"not json"` and empty body, 404 unknown part.
- [ ] **Step 2:** Run `npm test` -> FAIL. **Step 3:** Implement the four modules (route wraps `request.json()` in try/catch and never throws to a 500). **Step 4:** Run `npm test` -> PASS.
- [ ] **Step 5:** Commit `feat: lookup, advisories, severity and api route`.

### Task 5: Theme and page shell

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`

**Interfaces:**
- Produces: tokens `--bg`, `--panel`, `--line`, `--text`, `--muted`, `--accent`, `--warn`, `--danger`; font variables `--font-display`, `--font-mono`; `page.tsx` renders `<Header/>`, `<main id="main">` (placeholder for `<Loadout/>`), `<Footer/>`; visible "skip to content" link to `#main`.

- [ ] **Step 1:** Define tokens and fonts via `next/font`; set dark background on `body`; accent focus ring on `:focus-visible`; `@media (prefers-reduced-motion: reduce)` disables transitions/animations.
- [ ] **Step 2:** Build `Header` (wordmark "BCHECKER", one-line tagline) and `Footer` (author "Zxaviers", repo link placeholder). HUD framing via clipped corners / corner brackets, not rounded cards.
- [ ] **Step 3:** Run `npm run dev`; confirm at 360px and 1280px: no horizontal scroll, skip link works.
- [ ] **Step 4:** Commit `feat: hud theme and page shell`.

### Task 6: Selection state and pickers

**Files:**
- Create: `src/lib/selection.ts`, `src/lib/filterParts.ts`, `src/components/PartPicker.tsx`, `src/components/Segmented.tsx`, `src/components/Loadout.tsx`
- Test: `src/lib/selection.test.ts`, `src/lib/filterParts.test.ts`

**Interfaces:**
- Consumes: `CPUS`, `GPUS`, `RESOLUTIONS`, `PURPOSES`, `REFRESH_RATES`, `RAM_SIZES`.
- Produces (`selection.ts`): `interface Selection { cpuId: string | null; gpuId: string | null; resolutionId: ResolutionId | null; purposeId: PurposeId | null; refreshHz: RefreshHz | null; ramGb: RamGb | null }`; `type CompleteSelection = { cpuId: string; gpuId: string; resolutionId: ResolutionId; purposeId: PurposeId; refreshHz: RefreshHz | null; ramGb: RamGb | null }`; `EMPTY_SELECTION: Selection`; `isComplete(s: Selection): s is CompleteSelection` (requires cpu, gpu, resolution, purpose only).
- Produces (`filterParts.ts`): `export function filterParts<T extends { name: string; vendor: string }>(parts: T[], query: string, vendor: string | null): T[]` (case-insensitive; trims; every whitespace-separated word must appear in `name`; `vendor` null = all).
- Produces components: `PartPicker({ legend: string; parts: (Part)[]; value: string | null; onChange(id: string): void })` (filter input, vendor chips, scrollable `<fieldset>` of native radio inputs styled as slot cards with a mini score bar = `score / max score of the list`; empty-state text when nothing matches; selected part is shown in a pinned summary line even if filtered out); `Segmented` (radio group; props `legend`, `options: {id: string; label: string}[]`, `value`, `onChange`); `Loadout({ onAnalyze(sel: CompleteSelection): void; disabled?: boolean })` owning state, with purpose as a 6-option toggle grid, resolution as `Segmented`, and a collapsible "Advanced" panel (refresh rate, RAM; both optional with a "Not set" option) and the ANALYZE button with helper text naming what's missing.

- [ ] **Step 1: Write failing tests.** `isComplete`: `EMPTY_SELECTION` false; each of the four required fields null -> false; four set with optionals null -> true. `filterParts`: `"rtx 3070"` matches `"NVIDIA GeForce RTX 3070"`; `"  RTX3070"` behaviour: no match is acceptable only if the test documents it (assert it returns `[]` for `"rtx3070"`); vendor filter narrows; empty query + null vendor returns all; no match returns `[]`.
- [ ] **Step 2:** Run `npm test` -> FAIL. **Step 3:** Implement `selection.ts` and `filterParts.ts`; run -> PASS.
- [ ] **Step 4:** Build the components and mount `Loadout` in `page.tsx`.
- [ ] **Step 5:** Verify in the browser: Tab/arrow keys move through radios, typing in the filter narrows the list, ANALYZE enables only when the four required fields are set, layout works at 360px. Commit `feat: loadout pickers and selection state`.

### Task 7: Analyze flow, gauge, readout, advisories

**Files:**
- Create: `src/lib/analyze.ts`, `src/components/Gauge.tsx`, `src/components/Result.tsx`
- Modify: `src/app/page.tsx` (client wrapper holding result state)
- Test: `src/lib/analyze.test.ts`

**Interfaces:**
- Consumes: `POST /api/bottleneck`, `severity`, `CompleteSelection`.
- Produces (`analyze.ts`): `type AnalyzeResponse` (the 200 body shape from Task 4); `class AnalyzeError extends Error { kind: "invalid_input" | "not_found" | "network" }`; `export async function analyze(sel: CompleteSelection, signal?: AbortSignal): Promise<AnalyzeResponse>`.
- Produces: `Gauge({ percent: number; severity: Severity })` (segmented health-bar, `role="meter"` with `aria-valuenow/min/max`, readable label, fill transition disabled under reduced motion); `Result({ state: {status:"idle"} | {status:"loading"} | {status:"success"; data: AnalyzeResponse} | {status:"error"; kind: AnalyzeError["kind"]}; onRetry(): void })` with the status tag (note, uppercase), the limiting part, a "how this was calculated" readout (both scores with source links, GPU share, both powers), advisories list, `aria-live="polite"`.

- [ ] **Step 1: Write failing tests** for `analyze` with mocked `fetch`: 200 -> parsed data; 400 -> `AnalyzeError` `invalid_input`; 404 -> `not_found`; rejected fetch -> `network`; request is POST with JSON body including optional fields and passes `signal`.
- [ ] **Step 2:** Run `npm test` -> FAIL. **Step 3:** Implement `analyze.ts`; run -> PASS.
- [ ] **Step 4:** Build `Gauge`/`Result` and wire: ANALYZE -> loading -> success/error; abort the in-flight request when a new one starts or any selection changes; any selection change resets to idle.
- [ ] **Step 5:** Verify in the browser: i3-13100 + RTX 3090 gaming/FHD (CPU-limited, high); i9-13900 + RTX 3050 (GPU-limited); i5-13400 + RTX 3070 gaming/FHD (~0, empty gauge, BALANCED); 8 GB RAM gaming shows the advisory; double-click ANALYZE; change a slot after a result; stop the dev server and retry (error + Retry). Commit `feat: analyze flow, gauge and calculation readout`.

### Task 8: Content, README, final verification

**Files:**
- Create: `src/components/HowItWorks.tsx`, `src/components/AboutData.tsx`, `README.md` (replace scaffold), `docs/screenshot.png`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx` (metadata)

**Interfaces:**
- Consumes: `CPUS`, `GPUS`, `GPU_SHARE`, `RESOLUTIONS`, `PURPOSES`, `C_REF`, `G_REF` (sources table and share table are generated from data, not hand-copied).

- [ ] **Step 1:** Build `HowItWorks` (the model in plain words with one worked example) and `AboutData` (sources table with links and capture dates, the share table labelled as heuristic, the RAM rules, limits: single scores approximate, not per-game FPS, no laptop parts). Add page metadata.
- [ ] **Step 2:** Write `README.md`: what it is, screenshot, stack, `npm install / dev / test / build`, structure, how to add a part, method and calibration, data sources and terms note, limits, credit to the original Laravel version.
- [ ] **Step 3:** Run `npm test`, `npm run lint`, `npm run build`. Expected: all pass.
- [ ] **Step 4:** In the browser at 360, 768 and 1280px: no horizontal scroll, readable contrast, full keyboard-only run-through, reduced-motion emulation shows no fill animation. Capture `docs/screenshot.png` at desktop width.
- [ ] **Step 5:** Commit `docs: content sections, readme, screenshot`.
