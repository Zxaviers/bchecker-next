import {
  GPU_SHARE,
  type PurposeId,
  type RefreshHz,
  type ResolutionId,
} from "@/data/options";
import type { Cpu, Gpu } from "@/data/parts";
import { C_REF, G_REF } from "@/lib/calibration";

export type Status = "Balanced" | "Upgrade CPU" | "Upgrade GPU";

export interface Estimate {
  /** Percent of the stronger side's capability that goes unused, 0-100. */
  bottleneck: number;
  limiting: "CPU" | "GPU" | "none";
  note: Status;
  gpuShare: number;
  cpuPower: number;
  gpuPower: number;
}

const BALANCED_THRESHOLD = 10;
const MIN_SHARE = 0.1;
const MAX_SHARE = 0.9;

/** Higher target frame rates load the CPU more, so the GPU share drops. */
const REFRESH_REDUCTION: Record<RefreshHz, number> = {
  60: 0,
  120: 0.05,
  144: 0.05,
  240: 0.1,
};

const REFRESH_SENSITIVE: ReadonlySet<PurposeId> = new Set([
  "gaming",
  "esports",
  "streaming",
]);

export function clampShare(share: number): number {
  return Math.min(MAX_SHARE, Math.max(MIN_SHARE, share));
}

export function gpuShare(
  purpose: PurposeId,
  resolution: ResolutionId,
  refreshHz?: RefreshHz | null,
): number {
  const reduction =
    refreshHz != null && REFRESH_SENSITIVE.has(purpose)
      ? REFRESH_REDUCTION[refreshHz]
      : 0;
  return clampShare(GPU_SHARE[purpose][resolution] - reduction);
}

export function estimate(input: {
  cpu: Cpu;
  gpu: Gpu;
  resolution: ResolutionId;
  purpose: PurposeId;
  refreshHz?: RefreshHz | null;
}): Estimate {
  const share = gpuShare(input.purpose, input.resolution, input.refreshHz);
  const cpuPower = input.cpu.score / C_REF / (1 - share);
  const gpuPower = input.gpu.score / G_REF / share;

  const lower = Math.min(cpuPower, gpuPower);
  const higher = Math.max(cpuPower, gpuPower);
  const bottleneck = Math.round((1 - lower / higher) * 10000) / 100;

  const balanced = bottleneck <= BALANCED_THRESHOLD;
  const limiting = balanced ? "none" : cpuPower < gpuPower ? "CPU" : "GPU";
  const note: Status = balanced
    ? "Balanced"
    : limiting === "CPU"
      ? "Upgrade CPU"
      : "Upgrade GPU";

  return { bottleneck, limiting, note, gpuShare: share, cpuPower, gpuPower };
}
