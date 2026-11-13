export type ResolutionId = "hd" | "fhd" | "qhd" | "4k";
export type PurposeId =
  | "general"
  | "gaming"
  | "esports"
  | "streaming"
  | "video"
  | "render";
export type RefreshHz = 60 | 120 | 144 | 240;
export type RamGb = 8 | 16 | 32 | 64;

export const RESOLUTIONS: {
  id: ResolutionId;
  label: string;
  width: number;
  height: number;
}[] = [
  { id: "hd", label: "HD 720p", width: 1280, height: 720 },
  { id: "fhd", label: "FHD 1080p", width: 1920, height: 1080 },
  { id: "qhd", label: "QHD 1440p", width: 2560, height: 1440 },
  { id: "4k", label: "4K UHD", width: 3840, height: 2160 },
];

export const PURPOSES: { id: PurposeId; label: string }[] = [
  { id: "general", label: "General" },
  { id: "gaming", label: "Gaming" },
  { id: "esports", label: "Competitive / Esports" },
  { id: "streaming", label: "Streaming while gaming" },
  { id: "video", label: "Video editing" },
  { id: "render", label: "3D rendering" },
];

export const REFRESH_RATES: RefreshHz[] = [60, 120, 144, 240];
export const RAM_SIZES: RamGb[] = [8, 16, 32, 64];

/**
 * Share of the workload that falls on the GPU (the CPU gets 1 - share).
 * These are heuristic values chosen by the author, not measured data, and are
 * shown as such on the page.
 */
export const GPU_SHARE: Record<PurposeId, Record<ResolutionId, number>> = {
  general: { hd: 0.25, fhd: 0.25, qhd: 0.25, "4k": 0.25 },
  gaming: { hd: 0.45, fhd: 0.55, qhd: 0.65, "4k": 0.75 },
  esports: { hd: 0.3, fhd: 0.35, qhd: 0.45, "4k": 0.55 },
  streaming: { hd: 0.35, fhd: 0.4, qhd: 0.5, "4k": 0.6 },
  video: { hd: 0.5, fhd: 0.5, qhd: 0.5, "4k": 0.5 },
  render: { hd: 0.8, fhd: 0.8, qhd: 0.8, "4k": 0.8 },
};
