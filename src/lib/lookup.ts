import {
  PURPOSES,
  RAM_SIZES,
  REFRESH_RATES,
  RESOLUTIONS,
  type PurposeId,
  type RamGb,
  type RefreshHz,
  type ResolutionId,
} from "@/data/options";
import { CPUS, GPUS, type Cpu, type Gpu } from "@/data/parts";
import { ramAdvisories, type Advisory } from "@/lib/advisories";
import { estimate, type Estimate } from "@/lib/model";

export type LookupResult =
  | { ok: true; cpu: Cpu; gpu: Gpu; estimate: Estimate; advisories: Advisory[] }
  | { ok: false; error: "invalid_input" | "not_found" };

const INVALID = { ok: false, error: "invalid_input" } as const;
const NOT_FOUND = { ok: false, error: "not_found" } as const;

/** Returns the matching member of `allowed`, or undefined. */
function pick<T extends string | number>(
  value: unknown,
  allowed: readonly T[],
): T | undefined {
  return allowed.find((a) => a === value);
}

function isAbsent(value: unknown): boolean {
  return value === undefined || value === null;
}

export function lookup(input: unknown): LookupResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return INVALID;
  }
  const body = input as Record<string, unknown>;

  const { cpuId, gpuId } = body;
  if (typeof cpuId !== "string" || cpuId === "") return INVALID;
  if (typeof gpuId !== "string" || gpuId === "") return INVALID;

  const resolution: ResolutionId | undefined = pick(
    body.resolutionId,
    RESOLUTIONS.map((r) => r.id),
  );
  const purpose: PurposeId | undefined = pick(
    body.purposeId,
    PURPOSES.map((p) => p.id),
  );
  if (resolution === undefined || purpose === undefined) return INVALID;

  let refreshHz: RefreshHz | null = null;
  if (!isAbsent(body.refreshHz)) {
    const hz = pick(body.refreshHz, REFRESH_RATES);
    if (hz === undefined) return INVALID;
    refreshHz = hz;
  }

  let ramGb: RamGb | null = null;
  if (!isAbsent(body.ramGb)) {
    const gb = pick(body.ramGb, RAM_SIZES);
    if (gb === undefined) return INVALID;
    ramGb = gb;
  }

  const cpu = CPUS.find((c) => c.id === cpuId);
  const gpu = GPUS.find((g) => g.id === gpuId);
  if (!cpu || !gpu) return NOT_FOUND;

  return {
    ok: true,
    cpu,
    gpu,
    estimate: estimate({ cpu, gpu, resolution, purpose, refreshHz }),
    advisories: ramAdvisories(purpose, resolution, ramGb),
  };
}
