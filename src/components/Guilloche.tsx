import { useId } from "react";

const PERIOD = 80;

/** Phase-shifted sine waves: the interlaced security-print pattern of certificate borders. */
function wave(phase: number, height: number): string {
  const amp = height / 2 - 3;
  const mid = height / 2;
  let d = "";
  for (let x = 0; x <= PERIOD; x += 2) {
    const y = mid + amp * Math.sin((x / PERIOD) * 2 * Math.PI + phase);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)} `;
  }
  return d;
}

const PHASES = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 8);

export function Guilloche({
  className = "",
  height = 44,
}: {
  className?: string;
  height?: number;
}) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height={height}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width={PERIOD} height={height} patternUnits="userSpaceOnUse">
          {PHASES.map((p, i) => (
            <path
              key={p}
              d={wave(p, height)}
              fill="none"
              stroke="currentColor"
              strokeWidth={i % 2 === 0 ? 1.1 : 0.7}
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  );
}
