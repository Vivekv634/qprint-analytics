"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendRow {
  date: string;
  jobs_completed: number;
  jobs_errored: number;
  revenue: number;
}

interface TrendsChartProps {
  data30:  TrendRow[];
  data7:   TrendRow[];
  data90:  TrendRow[];
}

export function TrendsChart({ data30, data7, data90 }: TrendsChartProps) {
  const [window, setWindow] = useState<"7" | "30" | "90">("30");
  const data = window === "7" ? data7 : window === "90" ? data90 : data30;

  return (
    <div className="bg-[#0f0f23] border border-[#312e81] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-indigo-200">Daily Job Trends</p>
        <div className="flex gap-2">
          {(["7", "30", "90"] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={`text-[10px] px-2 py-1 rounded ${
                window === w
                  ? "bg-indigo-600 text-white"
                  : "bg-[#1e1b4b] text-indigo-300"
              }`}
            >
              {w}d
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#4b5563" }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 9, fill: "#4b5563" }} />
          <Tooltip contentStyle={{ background: "#0f0f23", border: "1px solid #312e81", fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Line type="monotone" dataKey="jobs_completed" stroke="#818cf8" dot={false} name="completed" strokeWidth={2} />
          <Line type="monotone" dataKey="jobs_errored"   stroke="#f87171" dot={false} name="errored"   strokeWidth={1.5} strokeDasharray="4 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
