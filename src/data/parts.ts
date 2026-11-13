/**
 * Hardware catalogue. Every score is the median Blender Open Data benchmark
 * score (Cycles path-tracing samples per minute) for that device, read from
 * https://opendata.blender.org (query endpoint, Blender 4.5.0 LTS) on
 * CAPTURED_ON. Blender Open Data states its data is license-free; see
 * docs/data-sources.md.
 *
 * One Blender version (4.5.0) is used for every part so scores are comparable:
 * pooling versions shifts GPU scores by roughly 15%. 4.5.0 is also the version
 * with broad coverage of both old and new hardware.
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
  "https://opendata.blender.org/benchmarks/query/?group_by=device_name&blender_version=4.5.0&compute_type=";

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
        source: `Blender Open Data (Blender 4.5.0, ${backend})`,
        sourceUrl: QUERY + backend,
        capturedOn: CAPTURED_ON,
      }) as unknown as P,
  );
}

export const CPUS: Cpu[] = make<CpuVendor, Cpu>("CPU", [
  ["intel-core-i3-4130", "Intel Core i3-4130", "Intel Core i3-4130 CPU @ 3.40GHz", "Intel", 22.9, 58],
  ["intel-core-i7-2600k", "Intel Core i7-2600K", "Intel Core i7-2600K CPU @ 3.40GHz", "Intel", 52.8, 6],
  ["intel-core-i5-3570k", "Intel Core i5-3570K", "Intel Core i5-3570K CPU @ 3.40GHz", "Intel", 36.8, 6],
  ["intel-core-i7-3770k", "Intel Core i7-3770K", "Intel Core i7-3770K CPU @ 3.50GHz", "Intel", 48.5, 11],
  ["intel-core-i5-4690k", "Intel Core i5-4690K", "Intel Core i5-4690K CPU @ 3.50GHz", "Intel", 57.4, 5],
  ["intel-core-i7-4790k", "Intel Core i7-4790K", "Intel Core i7-4790K CPU @ 4.00GHz", "Intel", 73.7, 29],
  ["intel-core-i5-6600k", "Intel Core i5-6600K", "Intel Core i5-6600K CPU @ 3.50GHz", "Intel", 65.4, 9],
  ["intel-core-i7-6700k", "Intel Core i7-6700K", "Intel Core i7-6700K CPU @ 4.00GHz", "Intel", 84.9, 35],
  ["intel-core-i5-7600k", "Intel Core i5-7600K", "Intel Core i5-7600K CPU @ 3.80GHz", "Intel", 67.3, 20],
  ["intel-core-i7-7700k", "Intel Core i7-7700K", "Intel Core i7-7700K CPU @ 4.20GHz", "Intel", 88.8, 38],
  ["intel-core-i5-8400", "Intel Core i5-8400", "Intel Core i5-8400 CPU @ 2.80GHz", "Intel", 78.1, 16],
  ["intel-core-i7-8700k", "Intel Core i7-8700K", "Intel Core i7-8700K CPU @ 3.70GHz", "Intel", 122.4, 42],
  ["intel-core-i5-9600k", "Intel Core i5-9600K", "Intel Core i5-9600K CPU @ 3.70GHz", "Intel", 101.4, 30],
  ["intel-core-i7-9700k", "Intel Core i7-9700K", "Intel Core i7-9700K CPU @ 3.60GHz", "Intel", 136.2, 41],
  ["intel-core-i9-9900k", "Intel Core i9-9900K", "Intel Core i9-9900K CPU @ 3.60GHz", "Intel", 169.7, 58],
  ["intel-core-i5-10400f", "Intel Core i5-10400F", "Intel Core i5-10400F CPU @ 2.90GHz", "Intel", 113.7, 38],
  ["intel-core-i7-10700k", "Intel Core i7-10700K", "Intel Core i7-10700K CPU @ 3.80GHz", "Intel", 180.4, 41],
  ["intel-core-i9-10900k", "Intel Core i9-10900K", "Intel Core i9-10900K CPU @ 3.70GHz", "Intel", 239.2, 29],
  ["intel-core-i5-11400f", "Intel Core i5-11400F", "Intel Core i5-11400F @ 2.60GHz", "Intel", 122.8, 24],
  ["intel-core-i7-11700k", "Intel Core i7-11700K", "Intel Core i7-11700K @ 3.60GHz", "Intel", 198.5, 18],
  ["intel-core-i9-11900k", "Intel Core i9-11900K", "Intel Core i9-11900K @ 3.50GHz", "Intel", 228.3, 19],
  ["intel-core-i3-12100f", "Intel Core i3-12100F", "Intel Core i3-12100F", "Intel", 105.5, 12],
  ["intel-core-i5-12400f", "Intel Core i5-12400F", "Intel Core i5-12400F", "Intel", 154.4, 97],
  ["intel-core-i5-12600k", "Intel Core i5-12600K", "Intel Core i5-12600K", "Intel", 222.4, 44],
  ["intel-core-i7-12700k", "Intel Core i7-12700K", "Intel Core i7-12700K", "Intel", 285.9, 120],
  ["intel-core-i9-12900k", "Intel Core i9-12900K", "Intel Core i9-12900K", "Intel", 353.6, 68],
  ["intel-core-i3-13100", "Intel Core i3-13100", "13th Gen Intel Core i3-13100", "Intel", 106.5, 2],
  ["intel-core-i5-13400", "Intel Core i5-13400", "13th Gen Intel Core i5-13400", "Intel", 191.9, 9],
  ["intel-core-i5-13400f", "Intel Core i5-13400F", "13th Gen Intel Core i5-13400F", "Intel", 205.4, 87],
  ["intel-core-i5-13600k", "Intel Core i5-13600K", "13th Gen Intel Core i5-13600K", "Intel", 302.3, 35],
  ["intel-core-i7-13700", "Intel Core i7-13700", "13th Gen Intel Core i7-13700", "Intel", 362.3, 9],
  ["intel-core-i7-13700f", "Intel Core i7-13700F", "13th Gen Intel Core i7-13700F", "Intel", 280.8, 14],
  ["intel-core-i7-13700k", "Intel Core i7-13700K", "13th Gen Intel Core i7-13700K", "Intel", 386.7, 122],
  ["intel-core-i9-13900", "Intel Core i9-13900", "13th Gen Intel Core i9-13900", "Intel", 319.7, 7],
  ["intel-core-i9-13900k", "Intel Core i9-13900K", "13th Gen Intel Core i9-13900K", "Intel", 484.1, 84],
  ["intel-core-i5-14400f", "Intel Core i5-14400F", "Intel Core i5-14400F", "Intel", 202.4, 45],
  ["intel-core-i5-14600k", "Intel Core i5-14600K", "Intel Core i5-14600K", "Intel", 301.5, 102],
  ["intel-core-i7-14700k", "Intel Core i7-14700K", "Intel Core i7-14700K", "Intel", 441.6, 106],
  ["intel-core-i9-14900k", "Intel Core i9-14900K", "Intel Core i9-14900K", "Intel", 507.5, 275],
  ["intel-core-ultra-5-245k", "Intel Core Ultra 5 245K", "Intel Core Ultra 5 245K", "Intel", 317.9, 25],
  ["intel-core-ultra-7-265k", "Intel Core Ultra 7 265K", "Intel Core Ultra 7 265K", "Intel", 478, 279],
  ["intel-core-ultra-9-285k", "Intel Core Ultra 9 285K", "Intel Core Ultra 9 285K", "Intel", 562, 280],
  ["amd-ryzen-5-1600", "AMD Ryzen 5 1600", "AMD Ryzen 5 1600 Six-Core Processor", "AMD", 96.7, 12],
  ["amd-ryzen-7-1700", "AMD Ryzen 7 1700", "AMD Ryzen 7 1700 Eight-Core Processor", "AMD", 116.6, 10],
  ["amd-ryzen-7-1800x", "AMD Ryzen 7 1800X", "AMD Ryzen 7 1800X Eight-Core Processor", "AMD", 140.2, 16],
  ["amd-ryzen-5-2600", "AMD Ryzen 5 2600", "AMD Ryzen 5 2600 Six-Core Processor", "AMD", 107.1, 68],
  ["amd-ryzen-7-2700x", "AMD Ryzen 7 2700X", "AMD Ryzen 7 2700X Eight-Core Processor", "AMD", 144.3, 38],
  ["amd-ryzen-5-3600", "AMD Ryzen 5 3600", "AMD Ryzen 5 3600 6-Core Processor", "AMD", 130.3, 156],
  ["amd-ryzen-5-3600x", "AMD Ryzen 5 3600X", "AMD Ryzen 5 3600X 6-Core Processor", "AMD", 137.9, 22],
  ["amd-ryzen-7-3700x", "AMD Ryzen 7 3700X", "AMD Ryzen 7 3700X 8-Core Processor", "AMD", 173.7, 105],
  ["amd-ryzen-9-3900x", "AMD Ryzen 9 3900X", "AMD Ryzen 9 3900X 12-Core Processor", "AMD", 268.4, 123],
  ["amd-ryzen-9-3950x", "AMD Ryzen 9 3950X", "AMD Ryzen 9 3950X 16-Core Processor", "AMD", 353.3, 47],
  ["amd-ryzen-5-5500", "AMD Ryzen 5 5500", "AMD Ryzen 5 5500", "AMD", 138.7, 97],
  ["amd-ryzen-5-5600", "AMD Ryzen 5 5600", "AMD Ryzen 5 5600 6-Core Processor", "AMD", 149.9, 131],
  ["amd-ryzen-5-5600x", "AMD Ryzen 5 5600X", "AMD Ryzen 5 5600X 6-Core Processor", "AMD", 151.2, 241],
  ["amd-ryzen-7-5700x", "AMD Ryzen 7 5700X", "AMD Ryzen 7 5700X 8-Core Processor", "AMD", 214.4, 424],
  ["amd-ryzen-7-5800x", "AMD Ryzen 7 5800X", "AMD Ryzen 7 5800X 8-Core Processor", "AMD", 207.2, 323],
  ["amd-ryzen-7-5800x3d", "AMD Ryzen 7 5800X3D", "AMD Ryzen 7 5800X3D 8-Core Processor", "AMD", 209.5, 128],
  ["amd-ryzen-9-5900x", "AMD Ryzen 9 5900X", "AMD Ryzen 9 5900X 12-Core Processor", "AMD", 305.9, 299],
  ["amd-ryzen-9-5950x", "AMD Ryzen 9 5950X", "AMD Ryzen 9 5950X 16-Core Processor", "AMD", 391.5, 491],
  ["amd-ryzen-5-7500f", "AMD Ryzen 5 7500F", "AMD Ryzen 5 7500F 6-Core Processor", "AMD", 194.2, 94],
  ["amd-ryzen-5-7600x", "AMD Ryzen 5 7600X", "AMD Ryzen 5 7600X 6-Core Processor", "AMD", 204, 143],
  ["amd-ryzen-7-7700x", "AMD Ryzen 7 7700X", "AMD Ryzen 7 7700X 8-Core Processor", "AMD", 279, 134],
  ["amd-ryzen-7-7800x3d", "AMD Ryzen 7 7800X3D", "AMD Ryzen 7 7800X3D 8-Core Processor", "AMD", 264, 362],
  ["amd-ryzen-9-7900x", "AMD Ryzen 9 7900X", "AMD Ryzen 9 7900X 12-Core Processor", "AMD", 413.6, 161],
  ["amd-ryzen-9-7950x3d", "AMD Ryzen 9 7950X3D", "AMD Ryzen 9 7950X3D 16-Core Processor", "AMD", 540.3, 211],
  ["amd-ryzen-5-9600x", "AMD Ryzen 5 9600X", "AMD Ryzen 5 9600X 6-Core Processor", "AMD", 262.7, 325],
  ["amd-ryzen-7-9700x", "AMD Ryzen 7 9700X", "AMD Ryzen 7 9700X 8-Core Processor", "AMD", 309.3, 439],
  ["amd-ryzen-7-9800x3d", "AMD Ryzen 7 9800X3D", "AMD Ryzen 7 9800X3D 8-Core Processor", "AMD", 333.9, 1084],
  ["amd-ryzen-9-9950x", "AMD Ryzen 9 9950X", "AMD Ryzen 9 9950X 16-Core Processor", "AMD", 625.4, 624],
]);

export const GPUS: Gpu[] = [
  ...make<GpuVendor, Gpu>("OPTIX", [
    ["nvidia-geforce-gtx-750-ti", "NVIDIA GeForce GTX 750 Ti", "NVIDIA GeForce GTX 750 Ti", "NVIDIA", 92.2, 5],
    ["nvidia-geforce-gtx-950", "NVIDIA GeForce GTX 950", "NVIDIA GeForce GTX 950", "NVIDIA", 113.9, 6],
    ["nvidia-geforce-gtx-960", "NVIDIA GeForce GTX 960", "NVIDIA GeForce GTX 960", "NVIDIA", 163.5, 17],
    ["nvidia-geforce-gtx-970", "NVIDIA GeForce GTX 970", "NVIDIA GeForce GTX 970", "NVIDIA", 254.8, 22],
    ["nvidia-geforce-gtx-980", "NVIDIA GeForce GTX 980", "NVIDIA GeForce GTX 980", "NVIDIA", 292.8, 5],
    ["nvidia-geforce-gtx-980-ti", "NVIDIA GeForce GTX 980 Ti", "NVIDIA GeForce GTX 980 Ti", "NVIDIA", 504.6, 10],
    ["nvidia-geforce-gtx-1050", "NVIDIA GeForce GTX 1050", "NVIDIA GeForce GTX 1050", "NVIDIA", 172.8, 36],
    ["nvidia-geforce-gtx-1050-ti", "NVIDIA GeForce GTX 1050 Ti", "NVIDIA GeForce GTX 1050 Ti", "NVIDIA", 208.2, 73],
    ["nvidia-geforce-gtx-1060-6gb", "NVIDIA GeForce GTX 1060 6GB", "NVIDIA GeForce GTX 1060 6GB", "NVIDIA", 360.2, 62],
    ["nvidia-geforce-gtx-1070", "NVIDIA GeForce GTX 1070", "NVIDIA GeForce GTX 1070", "NVIDIA", 520.6, 78],
    ["nvidia-geforce-gtx-1070-ti", "NVIDIA GeForce GTX 1070 Ti", "NVIDIA GeForce GTX 1070 Ti", "NVIDIA", 589.2, 25],
    ["nvidia-geforce-gtx-1080", "NVIDIA GeForce GTX 1080", "NVIDIA GeForce GTX 1080", "NVIDIA", 584.9, 81],
    ["nvidia-geforce-gtx-1080-ti", "NVIDIA GeForce GTX 1080 Ti", "NVIDIA GeForce GTX 1080 Ti", "NVIDIA", 821.3, 63],
    ["nvidia-geforce-gtx-1650", "NVIDIA GeForce GTX 1650", "NVIDIA GeForce GTX 1650", "NVIDIA", 424, 146],
    ["nvidia-geforce-gtx-1650-super", "NVIDIA GeForce GTX 1650 SUPER", "NVIDIA GeForce GTX 1650 SUPER", "NVIDIA", 554.8, 19],
    ["nvidia-geforce-gtx-1660", "NVIDIA GeForce GTX 1660", "NVIDIA GeForce GTX 1660", "NVIDIA", 679.7, 22],
    ["nvidia-geforce-gtx-1660-super", "NVIDIA GeForce GTX 1660 SUPER", "NVIDIA GeForce GTX 1660 SUPER", "NVIDIA", 748, 112],
    ["nvidia-geforce-gtx-1660-ti", "NVIDIA GeForce GTX 1660 Ti", "NVIDIA GeForce GTX 1660 Ti", "NVIDIA", 743, 62],
    ["nvidia-geforce-rtx-2060", "NVIDIA GeForce RTX 2060", "NVIDIA GeForce RTX 2060", "NVIDIA", 1562.4, 168],
    ["nvidia-geforce-rtx-2060-super", "NVIDIA GeForce RTX 2060 SUPER", "NVIDIA GeForce RTX 2060 SUPER", "NVIDIA", 2059.7, 109],
    ["nvidia-geforce-rtx-2070", "NVIDIA GeForce RTX 2070", "NVIDIA GeForce RTX 2070", "NVIDIA", 2105.4, 66],
    ["nvidia-geforce-rtx-2070-super", "NVIDIA GeForce RTX 2070 SUPER", "NVIDIA GeForce RTX 2070 SUPER", "NVIDIA", 2225, 105],
    ["nvidia-geforce-rtx-2080", "NVIDIA GeForce RTX 2080", "NVIDIA GeForce RTX 2080", "NVIDIA", 2279.5, 41],
    ["nvidia-geforce-rtx-2080-super", "NVIDIA GeForce RTX 2080 SUPER", "NVIDIA GeForce RTX 2080 SUPER", "NVIDIA", 2292.6, 40],
    ["nvidia-geforce-rtx-2080-ti", "NVIDIA GeForce RTX 2080 Ti", "NVIDIA GeForce RTX 2080 Ti", "NVIDIA", 2837.6, 136],
    ["nvidia-geforce-rtx-3050", "NVIDIA GeForce RTX 3050", "NVIDIA GeForce RTX 3050", "NVIDIA", 1344.7, 145],
    ["nvidia-geforce-rtx-3060", "NVIDIA GeForce RTX 3060", "NVIDIA GeForce RTX 3060", "NVIDIA", 2155.1, 632],
    ["nvidia-geforce-rtx-3060-ti", "NVIDIA GeForce RTX 3060 Ti", "NVIDIA GeForce RTX 3060 Ti", "NVIDIA", 2764.5, 232],
    ["nvidia-geforce-rtx-3070", "NVIDIA GeForce RTX 3070", "NVIDIA GeForce RTX 3070", "NVIDIA", 3190.1, 312],
    ["nvidia-geforce-rtx-3070-ti", "NVIDIA GeForce RTX 3070 Ti", "NVIDIA GeForce RTX 3070 Ti", "NVIDIA", 3494.4, 118],
    ["nvidia-geforce-rtx-3080", "NVIDIA GeForce RTX 3080", "NVIDIA GeForce RTX 3080", "NVIDIA", 4529.2, 579],
    ["nvidia-geforce-rtx-3080-ti", "NVIDIA GeForce RTX 3080 Ti", "NVIDIA GeForce RTX 3080 Ti", "NVIDIA", 5323.1, 209],
    ["nvidia-geforce-rtx-3090", "NVIDIA GeForce RTX 3090", "NVIDIA GeForce RTX 3090", "NVIDIA", 5412.2, 630],
    ["nvidia-geforce-rtx-4060", "NVIDIA GeForce RTX 4060", "NVIDIA GeForce RTX 4060", "NVIDIA", 3181.9, 439],
    ["nvidia-geforce-rtx-4060-ti", "NVIDIA GeForce RTX 4060 Ti", "NVIDIA GeForce RTX 4060 Ti", "NVIDIA", 3940.8, 332],
    ["nvidia-geforce-rtx-4070", "NVIDIA GeForce RTX 4070", "NVIDIA GeForce RTX 4070", "NVIDIA", 5219, 262],
    ["nvidia-geforce-rtx-4070-super", "NVIDIA GeForce RTX 4070 SUPER", "NVIDIA GeForce RTX 4070 SUPER", "NVIDIA", 6249.5, 469],
    ["nvidia-geforce-rtx-4070-ti", "NVIDIA GeForce RTX 4070 Ti", "NVIDIA GeForce RTX 4070 Ti", "NVIDIA", 6369.3, 156],
    ["nvidia-geforce-rtx-4070-ti-super", "NVIDIA GeForce RTX 4070 Ti SUPER", "NVIDIA GeForce RTX 4070 Ti SUPER", "NVIDIA", 7116.1, 253],
    ["nvidia-geforce-rtx-4080", "NVIDIA GeForce RTX 4080", "NVIDIA GeForce RTX 4080", "NVIDIA", 8388.1, 219],
    ["nvidia-geforce-rtx-4080-super", "NVIDIA GeForce RTX 4080 SUPER", "NVIDIA GeForce RTX 4080 SUPER", "NVIDIA", 8419.2, 239],
    ["nvidia-geforce-rtx-4090", "NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4090", "NVIDIA", 11061.5, 527],
    ["nvidia-geforce-rtx-5060", "NVIDIA GeForce RTX 5060", "NVIDIA GeForce RTX 5060", "NVIDIA", 3680.1, 373],
    ["nvidia-geforce-rtx-5060-ti", "NVIDIA GeForce RTX 5060 Ti", "NVIDIA GeForce RTX 5060 Ti", "NVIDIA", 4309.3, 655],
    ["nvidia-geforce-rtx-5070", "NVIDIA GeForce RTX 5070", "NVIDIA GeForce RTX 5070", "NVIDIA", 6173.5, 914],
    ["nvidia-geforce-rtx-5070-ti", "NVIDIA GeForce RTX 5070 Ti", "NVIDIA GeForce RTX 5070 Ti", "NVIDIA", 7589, 1416],
    ["nvidia-geforce-rtx-5080", "NVIDIA GeForce RTX 5080", "NVIDIA GeForce RTX 5080", "NVIDIA", 9138.2, 1432],
    ["nvidia-geforce-rtx-5090", "NVIDIA GeForce RTX 5090", "NVIDIA GeForce RTX 5090", "NVIDIA", 14966, 1555],
  ]),
  ...make<GpuVendor, Gpu>("HIP", [
    ["amd-radeon-rx-5500-xt", "AMD Radeon RX 5500 XT", "AMD Radeon RX 5500 XT", "AMD", 507.4, 6],
    ["amd-radeon-rx-5600-xt", "AMD Radeon RX 5600 XT", "AMD Radeon RX 5600 XT", "AMD", 696.3, 21],
    ["amd-radeon-rx-5700-xt", "AMD Radeon RX 5700 XT", "AMD Radeon RX 5700 XT", "AMD", 961.1, 51],
    ["amd-radeon-rx-6600", "AMD Radeon RX 6600", "AMD Radeon RX 6600", "AMD", 933.3, 89],
    ["amd-radeon-rx-6600-xt", "AMD Radeon RX 6600 XT", "AMD Radeon RX 6600 XT", "AMD", 1050.5, 39],
    ["amd-radeon-rx-6650-xt", "AMD Radeon RX 6650 XT", "AMD Radeon RX 6650 XT", "AMD", 1064.8, 24],
    ["amd-radeon-rx-6700-xt", "AMD Radeon RX 6700 XT", "AMD Radeon RX 6700 XT", "AMD", 1462.1, 85],
    ["amd-radeon-rx-6750-xt", "AMD Radeon RX 6750 XT", "AMD Radeon RX 6750 XT", "AMD", 1539.1, 23],
    ["amd-radeon-rx-6800", "AMD Radeon RX 6800", "AMD Radeon RX 6800", "AMD", 1872.3, 36],
    ["amd-radeon-rx-6800-xt", "AMD Radeon RX 6800 XT", "AMD Radeon RX 6800 XT", "AMD", 2406.1, 42],
    ["amd-radeon-rx-6900-xt", "AMD Radeon RX 6900 XT", "AMD Radeon RX 6900 XT", "AMD", 2603.4, 56],
    ["amd-radeon-rx-6950-xt", "AMD Radeon RX 6950 XT", "AMD Radeon RX 6950 XT", "AMD", 2623.1, 35],
    ["amd-radeon-rx-7600", "AMD Radeon RX 7600", "AMD Radeon RX 7600", "AMD", 1156.6, 75],
    ["amd-radeon-rx-7700-xt", "AMD Radeon RX 7700 XT", "AMD Radeon RX 7700 XT", "AMD", 2083.6, 24],
    ["amd-radeon-rx-7800-xt", "AMD Radeon RX 7800 XT", "AMD Radeon RX 7800 XT", "AMD", 2457.5, 98],
    ["amd-radeon-rx-7900-gre", "AMD Radeon RX 7900 GRE", "AMD Radeon RX 7900 GRE", "AMD", 2897.9, 44],
    ["amd-radeon-rx-7900-xt", "AMD Radeon RX 7900 XT", "AMD Radeon RX 7900 XT", "AMD", 3628.5, 128],
    ["amd-radeon-rx-7900-xtx", "AMD Radeon RX 7900 XTX", "AMD Radeon RX 7900 XTX", "AMD", 4328.7, 223],
    ["amd-radeon-rx-9060-xt", "AMD Radeon RX 9060 XT", "AMD Radeon RX 9060 XT", "AMD", 1615, 213],
    ["amd-radeon-rx-9070", "AMD Radeon RX 9070", "AMD Radeon RX 9070", "AMD", 2840.5, 90],
    ["amd-radeon-rx-9070-xt", "AMD Radeon RX 9070 XT", "AMD Radeon RX 9070 XT", "AMD", 3279.2, 676],
  ]),
  ...make<GpuVendor, Gpu>("ONEAPI", [
    ["intel-arc-a380", "Intel Arc A380", "Intel Arc A380 Graphics", "Intel", 520.3, 18],
    ["intel-arc-a580", "Intel Arc A580", "Intel Arc A580 Graphics", "Intel", 1876.1, 5],
    ["intel-arc-a750", "Intel Arc A750", "Intel Arc A750 Graphics", "Intel", 2226.4, 72],
    ["intel-arc-a770", "Intel Arc A770", "Intel Arc A770 Graphics", "Intel", 2448.2, 55],
    ["intel-arc-b570", "Intel Arc B570", "Intel Arc B570 Graphics", "Intel", 1853, 7],
    ["intel-arc-b580", "Intel Arc B580", "Intel Arc B580 Graphics", "Intel", 2373.1, 124],
  ]),
];
