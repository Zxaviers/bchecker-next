import type { Advisory } from "@/lib/advisories";
import type { Status } from "@/lib/model";
import type { CompleteSelection } from "@/lib/selection";

export type AnalyzeErrorKind = "invalid_input" | "not_found" | "network";

export class AnalyzeError extends Error {
  readonly kind: AnalyzeErrorKind;

  constructor(kind: AnalyzeErrorKind) {
    super(kind);
    this.name = "AnalyzeError";
    this.kind = kind;
  }
}

/** Body of a 200 response from POST /api/bottleneck. */
export interface AnalyzeResponse {
  cpuName: string;
  gpuName: string;
  cpuScore: number;
  gpuScore: number;
  bottleneck: number;
  limiting: "CPU" | "GPU" | "none";
  note: Status;
  gpuShare: number;
  cpuPower: number;
  gpuPower: number;
  advisories: Advisory[];
}

function isAbort(e: unknown): boolean {
  return (e as { name?: string } | null)?.name === "AbortError";
}

export async function analyze(
  selection: CompleteSelection,
  signal?: AbortSignal,
): Promise<AnalyzeResponse> {
  let res: Response;
  try {
    res = await fetch("/api/bottleneck", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(selection),
      signal,
    });
  } catch (e) {
    if (isAbort(e)) throw e;
    throw new AnalyzeError("network");
  }

  if (res.status === 400) throw new AnalyzeError("invalid_input");
  if (res.status === 404) throw new AnalyzeError("not_found");
  if (!res.ok) throw new AnalyzeError("network");

  try {
    return (await res.json()) as AnalyzeResponse;
  } catch (e) {
    if (isAbort(e)) throw e;
    throw new AnalyzeError("network");
  }
}
