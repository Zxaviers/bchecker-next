/**
 * Hardware catalogue. Every score is the median Blender Open Data benchmark
 * score (Cycles path-tracing samples per minute) for that device, read from
 * https://opendata.blender.org (query endpoint, Blender 5.2.0) on CAPTURED_ON.
 * Blender Open Data states its data is license-free; see docs/data-sources.md.
 *
 * Scores are NOT typed from memory: each row below was copied from the
 * query output. GPU backend per vendor: NVIDIA = OptiX, AMD = HIP,
 * Intel = oneAPI (the default Blender backend for each).
 */

export type CpuVendor = "Intel" | "AMD";
export type GpuVendor = "NVIDIA" | "AMD" | "Intel";

export interface Part {
  id: string;
  /** Display name. */
  name: string;
  /** Exact device name as listed by the source. */
  deviceName: string;
  vendor: string;
  /** Median Blender score (samples per minute). */
  score: number;
  /** Number of benchmark submissions behind the median. */
  samples: number;
  source: string;
  sourceUrl: string;
  /** ISO date the score was read. */
  capturedOn: string;
}

export interface Cpu extends Part {
  vendor: CpuVendor;
}

export interface Gpu extends Part {
  vendor: GpuVendor;
}

const CAPTURED_ON = "2026-11-13";
const QUERY =
  "https://opendata.blender.org/benchmarks/query/?group_by=device_name&blender_version=5.2.0&compute_type=";

type Row<V> = [id: string, name: string, deviceName: string, vendor: V, score: number, samples: number];

function make<V extends string, P extends Part>(
  backend: string,
  rows: Row<V>[],
): P[] {
  return rows.map(
    ([id, name, deviceName, vendor, score, samples]) =>
      ({
        id,
        name,
        deviceName,
        vendor,
        score,
        samples,
        source: `Blender Open Data (Blender 5.2.0, ${backend})`,
        sourceUrl: QUERY + backend,
        capturedOn: CAPTURED_ON,
      }) as unknown as P,
  );
}

export const CPUS: Cpu[] = make<CpuVendor, Cpu>("CPU", [
  ["intel-core-i3-13100", "Intel Core i3-13100", "13th Gen Intel Core i3-13100", "Intel", 114, 1],
  ["intel-core-i5-12400f", "Intel Core i5-12400F", "Intel Core i5-12400F", "Intel", 167.9, 16],
  ["intel-core-i5-13400f", "Intel Core i5-13400F", "13th Gen Intel Core i5-13400F", "Intel", 196.5, 10],
  ["intel-core-i5-14400f", "Intel Core i5-14400F", "Intel Core i5-14400F", "Intel", 212.8, 15],
  ["intel-core-i5-13600k", "Intel Core i5-13600K", "13th Gen Intel Core i5-13600K", "Intel", 314.8, 7],
  ["intel-core-i5-14600k", "Intel Core i5-14600K", "Intel Core i5-14600K", "Intel", 320, 32],
  ["intel-core-i7-12700k", "Intel Core i7-12700K", "Intel Core i7-12700K", "Intel", 300.9, 19],
  ["intel-core-i7-13700f", "Intel Core i7-13700F", "13th Gen Intel Core i7-13700F", "Intel", 244.9, 5],
  ["intel-core-i7-13700k", "Intel Core i7-13700K", "13th Gen Intel Core i7-13700K", "Intel", 383.5, 22],
  ["intel-core-i7-14700k", "Intel Core i7-14700K", "Intel Core i7-14700K", "Intel", 449.4, 20],
  ["intel-core-i9-12900k", "Intel Core i9-12900K", "Intel Core i9-12900K", "Intel", 338.5, 13],
  ["intel-core-i9-13900", "Intel Core i9-13900", "13th Gen Intel Core i9-13900", "Intel", 388.2, 8],
  ["intel-core-i9-13900k", "Intel Core i9-13900K", "13th Gen Intel Core i9-13900K", "Intel", 512.1, 24],
  ["intel-core-i9-14900k", "Intel Core i9-14900K", "Intel Core i9-14900K", "Intel", 524.8, 93],
  ["intel-core-ultra-5-245k", "Intel Core Ultra 5 245K", "Intel Core Ultra 5 245K", "Intel", 271.7, 28],
  ["intel-core-ultra-7-265k", "Intel Core Ultra 7 265K", "Intel Core Ultra 7 265K", "Intel", 482.1, 28],
  ["intel-core-ultra-9-285k", "Intel Core Ultra 9 285K", "Intel Core Ultra 9 285K", "Intel", 574.7, 123],
  ["amd-ryzen-5-3600", "AMD Ryzen 5 3600", "AMD Ryzen 5 3600 6-Core Processor", "AMD", 135.9, 46],
  ["amd-ryzen-5-5500", "AMD Ryzen 5 5500", "AMD Ryzen 5 5500", "AMD", 138.7, 21],
  ["amd-ryzen-5-5600", "AMD Ryzen 5 5600", "AMD Ryzen 5 5600 6-Core Processor", "AMD", 154.1, 61],
  ["amd-ryzen-5-5600x", "AMD Ryzen 5 5600X", "AMD Ryzen 5 5600X 6-Core Processor", "AMD", 161, 65],
  ["amd-ryzen-7-5700x", "AMD Ryzen 7 5700X", "AMD Ryzen 7 5700X 8-Core Processor", "AMD", 225.2, 116],
  ["amd-ryzen-7-5800x3d", "AMD Ryzen 7 5800X3D", "AMD Ryzen 7 5800X3D 8-Core Processor", "AMD", 227.7, 104],
  ["amd-ryzen-9-5900x", "AMD Ryzen 9 5900X", "AMD Ryzen 9 5900X 12-Core Processor", "AMD", 316.2, 48],
  ["amd-ryzen-9-5950x", "AMD Ryzen 9 5950X", "AMD Ryzen 9 5950X 16-Core Processor", "AMD", 413.7, 126],
  ["amd-ryzen-5-7500f", "AMD Ryzen 5 7500F", "AMD Ryzen 5 7500F 6-Core Processor", "AMD", 218.2, 71],
  ["amd-ryzen-5-7600x", "AMD Ryzen 5 7600X", "AMD Ryzen 5 7600X 6-Core Processor", "AMD", 214.4, 22],
  ["amd-ryzen-7-7700x", "AMD Ryzen 7 7700X", "AMD Ryzen 7 7700X 8-Core Processor", "AMD", 309.6, 41],
  ["amd-ryzen-7-7800x3d", "AMD Ryzen 7 7800X3D", "AMD Ryzen 7 7800X3D 8-Core Processor", "AMD", 293.2, 116],
  ["amd-ryzen-9-7900x", "AMD Ryzen 9 7900X", "AMD Ryzen 9 7900X 12-Core Processor", "AMD", 443.7, 28],
  ["amd-ryzen-9-7950x3d", "AMD Ryzen 9 7950X3D", "AMD Ryzen 9 7950X3D 16-Core Processor", "AMD", 580.4, 50],
  ["amd-ryzen-5-9600x", "AMD Ryzen 5 9600X", "AMD Ryzen 5 9600X 6-Core Processor", "AMD", 273.7, 79],
  ["amd-ryzen-7-9700x", "AMD Ryzen 7 9700X", "AMD Ryzen 7 9700X 8-Core Processor", "AMD", 321.1, 85],
  ["amd-ryzen-7-9800x3d", "AMD Ryzen 7 9800X3D", "AMD Ryzen 7 9800X3D 8-Core Processor", "AMD", 367.9, 222],
  ["amd-ryzen-9-9950x", "AMD Ryzen 9 9950X", "AMD Ryzen 9 9950X 16-Core Processor", "AMD", 665.8, 129],
]);

export const GPUS: Gpu[] = [
  ...make<GpuVendor, Gpu>("OPTIX", [
    ["nvidia-geforce-gtx-1650", "NVIDIA GeForce GTX 1650", "NVIDIA GeForce GTX 1650", "NVIDIA", 360.1, 46],
    ["nvidia-geforce-gtx-1660-super", "NVIDIA GeForce GTX 1660 SUPER", "NVIDIA GeForce GTX 1660 SUPER", "NVIDIA", 675.5, 27],
    ["nvidia-geforce-rtx-2060", "NVIDIA GeForce RTX 2060", "NVIDIA GeForce RTX 2060", "NVIDIA", 1416.6, 48],
    ["nvidia-geforce-rtx-2070-super", "NVIDIA GeForce RTX 2070 SUPER", "NVIDIA GeForce RTX 2070 SUPER", "NVIDIA", 2079.7, 23],
    ["nvidia-geforce-rtx-3050", "NVIDIA GeForce RTX 3050", "NVIDIA GeForce RTX 3050", "NVIDIA", 1127.9, 31],
    ["nvidia-geforce-rtx-3060", "NVIDIA GeForce RTX 3060", "NVIDIA GeForce RTX 3060", "NVIDIA", 1987.6, 121],
    ["nvidia-geforce-rtx-3060-ti", "NVIDIA GeForce RTX 3060 Ti", "NVIDIA GeForce RTX 3060 Ti", "NVIDIA", 2593.2, 80],
    ["nvidia-geforce-rtx-3070", "NVIDIA GeForce RTX 3070", "NVIDIA GeForce RTX 3070", "NVIDIA", 2978.1, 97],
    ["nvidia-geforce-rtx-3070-ti", "NVIDIA GeForce RTX 3070 Ti", "NVIDIA GeForce RTX 3070 Ti", "NVIDIA", 3394.2, 58],
    ["nvidia-geforce-rtx-3080", "NVIDIA GeForce RTX 3080", "NVIDIA GeForce RTX 3080", "NVIDIA", 4199.8, 101],
    ["nvidia-geforce-rtx-3090", "NVIDIA GeForce RTX 3090", "NVIDIA GeForce RTX 3090", "NVIDIA", 5077.6, 112],
    ["nvidia-geforce-rtx-4060", "NVIDIA GeForce RTX 4060", "NVIDIA GeForce RTX 4060", "NVIDIA", 2971.1, 76],
    ["nvidia-geforce-rtx-4060-ti", "NVIDIA GeForce RTX 4060 Ti", "NVIDIA GeForce RTX 4060 Ti", "NVIDIA", 3822.1, 72],
    ["nvidia-geforce-rtx-4070", "NVIDIA GeForce RTX 4070", "NVIDIA GeForce RTX 4070", "NVIDIA", 5114.2, 46],
    ["nvidia-geforce-rtx-4070-super", "NVIDIA GeForce RTX 4070 SUPER", "NVIDIA GeForce RTX 4070 SUPER", "NVIDIA", 5954.5, 126],
    ["nvidia-geforce-rtx-4080", "NVIDIA GeForce RTX 4080", "NVIDIA GeForce RTX 4080", "NVIDIA", 8283.5, 79],
    ["nvidia-geforce-rtx-4090", "NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4090", "NVIDIA", 11553.1, 118],
    ["nvidia-geforce-rtx-5060", "NVIDIA GeForce RTX 5060", "NVIDIA GeForce RTX 5060", "NVIDIA", 3682.5, 109],
    ["nvidia-geforce-rtx-5070", "NVIDIA GeForce RTX 5070", "NVIDIA GeForce RTX 5070", "NVIDIA", 5806.6, 192],
    ["nvidia-geforce-rtx-5080", "NVIDIA GeForce RTX 5080", "NVIDIA GeForce RTX 5080", "NVIDIA", 9155.3, 404],
    ["nvidia-geforce-rtx-5090", "NVIDIA GeForce RTX 5090", "NVIDIA GeForce RTX 5090", "NVIDIA", 16099.2, 233],
  ]),
  ...make<GpuVendor, Gpu>("HIP", [
    ["amd-radeon-rx-6600", "AMD Radeon RX 6600", "AMD Radeon RX 6600", "AMD", 754.4, 19],
    ["amd-radeon-rx-6600-xt", "AMD Radeon RX 6600 XT", "AMD Radeon RX 6600 XT", "AMD", 783.3, 7],
    ["amd-radeon-rx-6700-xt", "AMD Radeon RX 6700 XT", "AMD Radeon RX 6700 XT", "AMD", 1645.8, 23],
    ["amd-radeon-rx-6800", "AMD Radeon RX 6800", "AMD Radeon RX 6800", "AMD", 2060, 23],
    ["amd-radeon-rx-6800-xt", "AMD Radeon RX 6800 XT", "AMD Radeon RX 6800 XT", "AMD", 2617.8, 21],
    ["amd-radeon-rx-6900-xt", "AMD Radeon RX 6900 XT", "AMD Radeon RX 6900 XT", "AMD", 2846.4, 13],
    ["amd-radeon-rx-7600", "AMD Radeon RX 7600", "AMD Radeon RX 7600", "AMD", 1224.1, 20],
    ["amd-radeon-rx-7700-xt", "AMD Radeon RX 7700 XT", "AMD Radeon RX 7700 XT", "AMD", 2327.6, 9],
    ["amd-radeon-rx-7800-xt", "AMD Radeon RX 7800 XT", "AMD Radeon RX 7800 XT", "AMD", 2763.4, 22],
    ["amd-radeon-rx-7900-xt", "AMD Radeon RX 7900 XT", "AMD Radeon RX 7900 XT", "AMD", 4101.1, 33],
    ["amd-radeon-rx-7900-xtx", "AMD Radeon RX 7900 XTX", "AMD Radeon RX 7900 XTX", "AMD", 4987.1, 77],
    ["amd-radeon-rx-9060-xt", "AMD Radeon RX 9060 XT", "AMD Radeon RX 9060 XT", "AMD", 1662.3, 68],
    ["amd-radeon-rx-9070", "AMD Radeon RX 9070", "AMD Radeon RX 9070", "AMD", 2984.5, 31],
    ["amd-radeon-rx-9070-xt", "AMD Radeon RX 9070 XT", "AMD Radeon RX 9070 XT", "AMD", 3364.9, 432],
  ]),
  ...make<GpuVendor, Gpu>("ONEAPI", [
    ["intel-arc-a750", "Intel Arc A750", "Intel Arc A750 Graphics", "Intel", 1931.5, 9],
    ["intel-arc-a770", "Intel Arc A770", "Intel Arc A770 Graphics", "Intel", 2490.9, 8],
    ["intel-arc-b580", "Intel Arc B580", "Intel Arc B580 Graphics", "Intel", 2842.5, 24],
    ["intel-arc-b570", "Intel Arc B570", "Intel Arc B570 Graphics", "Intel", 2208.1, 6],
  ]),
];
