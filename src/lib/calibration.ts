import { CPUS, GPUS } from "@/data/parts";

/**
 * Calibration so that i5-13400F + RTX 3070 at gaming / FHD / 60 Hz is balanced.
 * With GPU share s = 0.55: cpuPower = (C / C_REF) / 0.45 and
 * gpuPower = (G / G_REF) / 0.55. Setting C_REF = score(i5-13400F) and
 * G_REF = score(RTX 3070) * 0.45 / 0.55 makes both powers equal 1 / 0.45.
 */
const CPU_REF_ID = "intel-core-i5-13400f";
const GPU_REF_ID = "nvidia-geforce-rtx-3070";

const refCpu = CPUS.find((c) => c.id === CPU_REF_ID);
const refGpu = GPUS.find((g) => g.id === GPU_REF_ID);
if (!refCpu || !refGpu) {
  throw new Error("Calibration reference parts are missing from the catalogue");
}

export const C_REF: number = refCpu.score;
export const G_REF: number = (refGpu.score * 0.45) / 0.55;
