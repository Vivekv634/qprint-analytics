import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  highlight?: "violet" | "amber" | "rose" | "emerald" | "sky" | "default";
  delay?: number;
}

const themeMap = {
  violet:  {
    glow:    "rgba(124,111,247,0.22)",
    icon:    "bg-violet-100 text-violet-600",
    value:   "text-violet-700",
    bar:     "#7c6ff7",
    border:  "rgba(124,111,247,0.25)",
    labelBg: "bg-violet-50",
  },
  amber: {
    glow:    "rgba(245,158,11,0.18)",
    icon:    "bg-amber-100 text-amber-600",
    value:   "text-amber-700",
    bar:     "#f59e0b",
    border:  "rgba(245,158,11,0.25)",
    labelBg: "bg-amber-50",
  },
  rose: {
    glow:    "rgba(251,113,133,0.18)",
    icon:    "bg-rose-100 text-rose-500",
    value:   "text-rose-600",
    bar:     "#fb7185",
    border:  "rgba(251,113,133,0.25)",
    labelBg: "bg-rose-50",
  },
  emerald: {
    glow:    "rgba(52,211,153,0.18)",
    icon:    "bg-emerald-100 text-emerald-600",
    value:   "text-emerald-700",
    bar:     "#34d399",
    border:  "rgba(52,211,153,0.25)",
    labelBg: "bg-emerald-50",
  },
  sky: {
    glow:    "rgba(56,189,248,0.18)",
    icon:    "bg-sky-100 text-sky-600",
    value:   "text-sky-700",
    bar:     "#38bdf8",
    border:  "rgba(56,189,248,0.25)",
    labelBg: "bg-sky-50",
  },
  default: {
    glow:    "rgba(124,111,247,0.12)",
    icon:    "bg-slate-100 text-slate-500",
    value:   "text-slate-800",
    bar:     "#94a3b8",
    border:  "rgba(100,116,139,0.18)",
    labelBg: "bg-slate-50",
  },
} as const;

export function KpiCard({ label, value, sub, icon: Icon, highlight = "default", delay = 0 }: KpiCardProps) {
  const t = themeMap[highlight];

  return (
    <div
      className="glass animate-in group relative overflow-hidden p-5 flex flex-col gap-3 cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        border: `1px solid ${t.border}`,
        boxShadow: `0 4px 24px ${t.glow}, 0 1px 4px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Top color strip */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[1rem]"
        style={{ background: t.bar }}
      />

      <div className="flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", t.icon)}>
          <Icon size={16} strokeWidth={2} />
        </div>
        <span
          className={cn("text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md", t.labelBg)}
          style={{ color: t.bar }}
        >
          {label}
        </span>
      </div>

      <div>
        <p
          className={cn("text-2xl font-bold tracking-tight leading-none", t.value)}
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-[10px] text-[var(--text-muted)] mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}
