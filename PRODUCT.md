# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Inferred (user said "choose for yourself"; not interviewed). People deciding whether their CPU and GPU suit each other: PC builders and upgraders, students and gamers, plus the reviewers (recruiters, peers) looking at this as a portfolio piece by Zxaviers. They arrive with a specific pair of parts in mind and want a quick, believable answer.

## Product Purpose
BChecker estimates which of two PC parts (CPU or GPU) holds the other back, and by how much, for a chosen use (6 purposes), resolution (4) and optional refresh rate and RAM. Success: someone picks two parts, sees a clear verdict and can see exactly how it was reached.

## Positioning
The math is visible and the data is cited. Every score is a median from the public Blender Open Data benchmark, each with its source and submission count; the result shows the formula working, not a black-box percentage. No neighbouring calculator can truthfully copy "every number traces to a cited public source".

## Operating Context
A single page. Pick a CPU (70) and GPU (75) from searchable lists, pick resolution and purpose, optionally refresh rate and RAM, press Analyze, read the result and its working. Below: how it works, and about the data (sources, limits, heuristic workload shares).

## Capabilities and Constraints
- Next.js 16 App Router, TypeScript, Tailwind v4; no database; deploys static plus one API route.
- Scores are rendering speed (Blender Cycles samples/min), not game FPS: results are estimates and must be framed so.
- Workload shares, refresh-rate effect and RAM advice are the author's heuristics, labelled as such. Only CPU and GPU scores are data.
- Desktop parts only. GPU backend differs by vendor (OptiX/HIP/oneAPI): cross-vendor comparison is approximate.
- Logic, API, tests (95+) and accessibility (native radio groups, meter role, keyboard, reduced motion) must be preserved by any redesign.

## Brand Commitments
Name: BChecker. Author credit: Zxaviers. Previous look (dark near-black, acid-green neon, corner brackets, mono eyebrows, grid backdrop) is explicitly rejected by the user ("the design is too bad") and is the anti-reference. The first light redesign was then called "too flat" by the user: depth must come from the world itself (sheet on a desk, soft cast shadows, recessed entry boxes), never from neon glow or fake grain.

## Evidence on Hand
Real: 145 scored parts with sources in src/data/parts.ts; docs/data-sources.md. Absent and not to be invented: testimonials, user counts, game FPS, prices, store links.

## Product Principles
1. Show the working: the calculation is part of the product.
2. Honest about limits: it is an estimate; say so where the number is.
3. One clear verdict first, details on demand.
4. Fast to a result: two parts, two choices, one action.

## Accessibility & Inclusion
Keyboard-complete, screen-reader labelled, WCAG AA contrast, honours prefers-reduced-motion, works at 360px width.
