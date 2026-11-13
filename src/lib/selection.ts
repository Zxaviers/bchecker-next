import type {
  PurposeId,
  RamGb,
  RefreshHz,
  ResolutionId,
} from "@/data/options";

export interface Selection {
  cpuId: string | null;
  gpuId: string | null;
  resolutionId: ResolutionId | null;
  purposeId: PurposeId | null;
  refreshHz: RefreshHz | null;
  ramGb: RamGb | null;
}

export type CompleteSelection = {
  cpuId: string;
  gpuId: string;
  resolutionId: ResolutionId;
  purposeId: PurposeId;
  refreshHz: RefreshHz | null;
  ramGb: RamGb | null;
};

export const EMPTY_SELECTION: Selection = {
  cpuId: null,
  gpuId: null,
  resolutionId: null,
  purposeId: null,
  refreshHz: null,
  ramGb: null,
};

/** CPU, GPU, resolution and purpose are required; refresh rate and RAM are optional. */
export function isComplete(s: Selection): s is CompleteSelection {
  return (
    s.cpuId !== null &&
    s.gpuId !== null &&
    s.resolutionId !== null &&
    s.purposeId !== null
  );
}
