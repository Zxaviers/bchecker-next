import type { PurposeId, RamGb, ResolutionId } from "@/data/options";

export interface Advisory {
  id: "ram-gaming-16" | "ram-pro-32" | "ram-4k-32";
  message: string;
}

const GAMING_PURPOSES: ReadonlySet<PurposeId> = new Set([
  "gaming",
  "esports",
  "streaming",
]);
const PRO_PURPOSES: ReadonlySet<PurposeId> = new Set(["video", "render"]);

/**
 * Rule-based RAM notes. These never change the bottleneck percentage; they are
 * commonly cited guidelines, not measurements.
 */
export function ramAdvisories(
  purpose: PurposeId,
  resolution: ResolutionId,
  ramGb?: RamGb | null,
): Advisory[] {
  if (ramGb == null) return [];
  const out: Advisory[] = [];
  if (GAMING_PURPOSES.has(purpose) && ramGb < 16) {
    out.push({
      id: "ram-gaming-16",
      message: "16 GB is the commonly recommended minimum for modern games.",
    });
  }
  if (PRO_PURPOSES.has(purpose) && ramGb < 32) {
    out.push({
      id: "ram-pro-32",
      message: "Video editing and 3D rendering usually benefit from 32 GB or more.",
    });
  }
  if (resolution === "4k" && ramGb < 32) {
    out.push({
      id: "ram-4k-32",
      message: "4K workloads commonly use 32 GB or more.",
    });
  }
  return out;
}
