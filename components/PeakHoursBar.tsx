"use client";

interface PeakHoursBarProps {
  hours: number[]; // length 24
}

function fmt(h: number) {
  if (h === 0)  return "12 AM";
  if (h < 12)  return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export function PeakHoursBar({ hours }: PeakHoursBarProps) {
  const max = Math.max(...hours, 1);
  const busiest = hours.indexOf(Math.max(...hours));

  // Map intensity to a color stop on violet→amber gradient
  function cellColor(intensity: number): string {
    if (intensity < 0.2) return "#ede9fe";          // near-zero: very soft violet
    if (intensity < 0.45) return "#a78bfa";          // low: lavender
    if (intensity < 0.7)  return "#7c6ff7";          // mid: accent violet
    if (intensity < 0.88) return "#f59e0b";          // high: amber
    return "#ef4444";                                 // peak: red-amber
  }

  return (
    <div className="glass animate-in p-6 flex flex-col" style={{ animationDelay: "120ms" }}>
      <div className="mb-5">
        <p
          className="text-base font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Activity by Hour
        </p>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
          Average job volume per time slot
        </p>
      </div>

      {/* AM row */}
      <div className="mb-1">
        <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">AM</p>
        <div className="grid grid-cols-12 gap-1">
          {hours.slice(0, 12).map((count, i) => {
            const intensity = count / max;
            return (
              <div
                key={i}
                title={`${fmt(i)} · ${count} jobs`}
                className="rounded-md h-7 transition-transform hover:scale-110 cursor-default"
                style={{ background: cellColor(intensity) }}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-4 mt-1">
          {[0, 3, 6, 9].map((h) => (
            <span key={h} className="text-[8px] text-[var(--text-muted)]">{fmt(h)}</span>
          ))}
        </div>
      </div>

      {/* PM row */}
      <div className="mt-3">
        <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">PM</p>
        <div className="grid grid-cols-12 gap-1">
          {hours.slice(12).map((count, i) => {
            const intensity = count / max;
            return (
              <div
                key={i + 12}
                title={`${fmt(i + 12)} · ${count} jobs`}
                className="rounded-md h-7 transition-transform hover:scale-110 cursor-default"
                style={{ background: cellColor(intensity) }}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-4 mt-1">
          {[12, 15, 18, 21].map((h) => (
            <span key={h} className="text-[8px] text-[var(--text-muted)]">{fmt(h)}</span>
          ))}
        </div>
      </div>

      {/* Busiest badge */}
      <div className="mt-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
        <p className="text-[11px] text-[var(--text-secondary)]">
          Busiest hour:{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {fmt(busiest)} – {fmt(busiest + 1)}
          </span>
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
            {hours[busiest]} jobs
          </span>
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex gap-0.5">
          {["#ede9fe","#a78bfa","#7c6ff7","#f59e0b","#ef4444"].map((c) => (
            <div key={c} className="w-4 h-2 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[9px] text-[var(--text-muted)]">low → peak</span>
      </div>
    </div>
  );
}
