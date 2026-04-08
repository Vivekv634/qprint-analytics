"use client";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

interface TrendRow {
  date: string;
  jobs_completed: number;
  jobs_errored: number;
  revenue: number;
}

interface TrendsChartProps {
  data30: TrendRow[];
  data7:  TrendRow[];
  data90: TrendRow[];
}

type Window = "7" | "30" | "90";

const WINDOWS: { key: Window; label: string }[] = [
  { key: "7",  label: "7 days"  },
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
];

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-4 py-3 text-xs space-y-1.5 min-w-[160px]">
      <p className="font-semibold text-[var(--text-primary)] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-[var(--text-primary)]">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendsChart({ data30, data7, data90 }: TrendsChartProps) {
  const [window, setWindow] = useState<Window>("30");
  const data = window === "7" ? data7 : window === "90" ? data90 : data30;

  const gradId = "completedGrad";
  const gradIdErr = "erroredGrad";

  return (
    <div className="glass animate-in p-6" style={{ animationDelay: "80ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p
            className="text-base font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Daily Job Trends
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Completed vs errored print jobs
          </p>
        </div>
        <div className="flex gap-1 bg-[var(--accent-soft)] p-1 rounded-lg">
          {WINDOWS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setWindow(key)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-md transition-all duration-200"
              style={
                window === key
                  ? { background: "#fff", color: "var(--accent)", boxShadow: "0 1px 4px rgba(124,111,247,0.2)" }
                  : { color: "var(--text-secondary)" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#7c6ff7" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#7c6ff7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={gradIdErr} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#fb7185" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,111,247,0.08)" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#a3a3b3", fontFamily: "var(--font-dm-sans)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#a3a3b3", fontFamily: "var(--font-dm-sans)" }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(124,111,247,0.2)", strokeWidth: 1 }} />

          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)", paddingTop: 12 }}
            iconType="circle"
            iconSize={7}
          />

          <Area
            type="monotone"
            dataKey="jobs_completed"
            stroke="#7c6ff7"
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 4, fill: "#7c6ff7", stroke: "#fff", strokeWidth: 2 }}
            name="Completed"
          />
          <Area
            type="monotone"
            dataKey="jobs_errored"
            stroke="#fb7185"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            fill={`url(#${gradIdErr})`}
            dot={false}
            activeDot={{ r: 4, fill: "#fb7185", stroke: "#fff", strokeWidth: 2 }}
            name="Errored"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
