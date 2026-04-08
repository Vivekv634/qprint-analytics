"use client";

interface PeakHoursBarProps {
  hours: number[];  // length 24
}

export function PeakHoursBar({ hours }: PeakHoursBarProps) {
  const max = Math.max(...hours, 1);
  const busiest = hours.indexOf(Math.max(...hours));

  return (
    <div className="bg-[#0f0f23] border border-[#312e81] rounded-xl p-4">
      <p className="text-sm font-semibold text-indigo-200 mb-4">Peak Hours</p>
      <div className="grid grid-cols-12 gap-1 mb-1">
        {hours.slice(0, 12).map((count, i) => (
          <div
            key={i}
            title={`${i}:00 — ${count} jobs`}
            className="rounded-sm h-5"
            style={{ background: "#4f46e5", opacity: 0.1 + (count / max) * 0.9 }}
          />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-1 mb-2">
        {hours.slice(12).map((count, i) => (
          <div
            key={i + 12}
            title={`${i + 12}:00 — ${count} jobs`}
            className="rounded-sm h-5"
            style={{ background: "#4f46e5", opacity: 0.1 + (count / max) * 0.9 }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[8px] text-gray-500 mb-3">
        <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
      </div>
      <div className="bg-[#0d1117] rounded px-2 py-1 text-[10px] text-indigo-300">
        Busiest: <span className="font-semibold text-white">{busiest}:00 – {busiest + 1}:00</span>
      </div>
    </div>
  );
}
