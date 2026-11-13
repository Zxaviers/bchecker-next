# Data sources (checked 2026-11-13)

## Source used: Blender Open Data
- Site: https://opendata.blender.org . Its About page (https://opendata.blender.org/about/) states the data is "License-free", machine-processable, anonymous, with no registration, and can be queried and downloaded (JSON/CSV) from the Search page.
- Method: the site's own query endpoint (the same one its Search page calls), `compute_type=<CPU|OPTIX|HIP|ONEAPI>&blender_version=5.2.0&group_by=device_name`, read on 2026-11-13. 74 parts were selected (35 CPUs, 39 GPUs) and recorded with the device name exactly as listed, the **median score** (rounded to 1 decimal) and the number of submissions behind it. After writing `src/data/parts.ts`, every value was re-checked against the live data by SHA-1 over all rows (0 mismatches).
- Score meaning: samples per minute for Blender Cycles path tracing (a rendering benchmark), **not game frame rates**. The model treats it as a relative throughput index; the page says so.
- GPU backend per vendor is the Blender default: NVIDIA = OptiX (uses RT hardware), AMD = HIP, Intel = oneAPI. Cross-vendor comparisons are therefore approximate (OptiX flatters NVIDIA relative to AMD/Intel in Blender). Within a vendor the ranking is consistent.
- Sample counts: all parts have at least 5 submissions except Intel Core i3-13100 (1 submission, kept because it is an original part; flagged on the page).
- Name mapping: the original non-F parts are not listed individually, so the nearest listed variant is used: i5-13400F (same silicon class, no iGPU) for i5-13400, i7-13700F for i7-13700.

## Rejected source: PassMark (cpubenchmark.net / videocardbenchmark.net)
Terms page: https://www.passmark.com/legal/disclaimer.php (section "Copyright & trademarks"): the Site is copyright; material may be reproduced in unaltered form for personal, non-commercial use or use within an organisation only; information "may not be reproduced in whole or in part for general publication or commercial purposes without the permission of the Host". Publishing its scores on a public site would need PassMark's permission, so it was not used.
