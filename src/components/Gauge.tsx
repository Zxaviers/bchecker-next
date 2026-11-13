import type { Severity } from "@/lib/severity";

const NUMERALS = [0, 25, 50, 75, 100];
const TICKS = Array.from({ length: 101 }, (_, i) => i);

const FILL: Record<Severity, string> = {
  low: "bg-accent",
  mid: "bg-warn",
  high: "bg-danger",
};

interface GaugeProps {
  percent: number;
  severity: Severity;
}

/** Length of a tick in px: majors every 25, mediums every 5, minors every 1. */
function tickLength(i: number): number {
  if (i % 25 === 0) return 30;
  if (i % 5 === 0) return 20;
  return 10;
}

/**
 * A graduated scale like a caliper or thermometer: ticks every 1%, longer at
 * every 5% and 25%, an ink fill from 0 to the value and a pointer at the value.
 * The role="meter" wrapper carries the value for assistive technology; the
 * numerals and ticks are decoration.
 */
export function Gauge({ percent, severity }: GaugeProps) {
  const pct = Math.min(100, Math.max(0, percent));

  return (
    <div
      role="meter"
      aria-label="Bottleneck"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${percent.toFixed(2)} percent`}
      className="entry px-4 pb-9 pt-4"
    >
      <div className="relative h-16">
        <div
          data-fill
          className={`absolute left-0 top-3 h-4 ${FILL[severity]}`}
          style={{ width: `${pct}%` }}
        />
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-8 w-full overflow-visible text-line-strong"
        >
          {TICKS.map((i) => (
            <line
              key={i}
              x1={`${i}%`}
              x2={`${i}%`}
              y1={0}
              y2={tickLength(i)}
              stroke="currentColor"
              strokeWidth={i % 25 === 0 ? 2 : 1}
            />
          ))}
        </svg>
        <div
          data-pointer
          aria-hidden="true"
          className="absolute -top-1 bottom-0 w-0.5 -translate-x-1/2 bg-line-strong"
          style={{ left: `${pct}%` }}
        >
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-line-strong" />
        </div>
        <div aria-hidden="true" className="typed absolute inset-x-0 -bottom-7 text-sm text-muted">
          {NUMERALS.map((n) => (
            <span
              key={n}
              data-numeral
              className="absolute -translate-x-1/2"
              style={{ left: `${n}%` }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
