import { getDb } from "@/lib/mongodb";
import { getSummary, getTrends, getPeakHours, getCampuses } from "@/lib/db/analytics";
import { KpiCard } from "@/components/KpiCard";
import { TrendsChart } from "@/components/TrendsChart";
import { PeakHoursBar } from "@/components/PeakHoursBar";
import { CampusTable } from "@/components/CampusTable";
import {
  Printer,
  Files,
  Palette,
  FileText,
  IndianRupee,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface TrendRow {
  date: string;
  jobs_completed: number;
  jobs_errored: number;
  revenue: number;
}

interface CampusRow {
  college_name: string;
  shops_count: number;
  jobs_completed: number;
  revenue: number;
}

export const revalidate = 300;

export default async function DashboardPage() {
  const db = await getDb();
  const [summary, trends30, trends7, trends90, peakHoursData, campuses] =
    await Promise.all([
      getSummary(db),
      getTrends(db, 30) as Promise<TrendRow[]>,
      getTrends(db, 7)  as Promise<TrendRow[]>,
      getTrends(db, 90) as Promise<TrendRow[]>,
      getPeakHours(db),
      getCampuses(db)   as Promise<CampusRow[]>,
    ]);

  return (
    <div className="mesh-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Nav ── */}
        <nav className="glass animate-in flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #7c6ff7 0%, #a78bfa 100%)" }}
            >
              Q
            </div>
            <div>
              <span
                className="font-bold text-[var(--text-primary)] text-sm leading-none block"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                QPrint Analytics
              </span>
              <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
                Live · synced every 5 min
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
            <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
              <Activity size={14} className="text-[var(--accent)]" />
            </div>
          </div>
        </nav>

        {/* ── KPI Cards ── */}
        <section>
          <p
            className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 px-1"
          >
            All-time totals
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KpiCard
              label="Jobs Done"
              value={summary.total_jobs.toLocaleString()}
              icon={Printer}
              highlight="violet"
              delay={0}
            />
            <KpiCard
              label="Files Printed"
              value={summary.total_files.toLocaleString()}
              icon={Files}
              highlight="sky"
              delay={40}
            />
            <KpiCard
              label="Color Pages"
              value={summary.total_pages_color.toLocaleString()}
              icon={Palette}
              highlight="rose"
              delay={80}
            />
            <KpiCard
              label="B&W Pages"
              value={summary.total_pages_bw.toLocaleString()}
              icon={FileText}
              highlight="default"
              delay={120}
            />
            <KpiCard
              label="Revenue"
              value={`₹${(summary.total_revenue / 100000).toFixed(2)}L`}
              icon={IndianRupee}
              highlight="amber"
              delay={160}
            />
            <KpiCard
              label="Success Rate"
              value={`${summary.success_rate}%`}
              icon={CheckCircle2}
              highlight="emerald"
              delay={200}
            />
          </div>
        </section>

        {/* ── Charts Row ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TrendsChart data30={trends30} data7={trends7} data90={trends90} />
          </div>
          <PeakHoursBar hours={peakHoursData} />
        </section>

        {/* ── Campus Table ── */}
        <section>
          <CampusTable campuses={campuses} />
        </section>

        {/* ── Footer ── */}
        <footer className="text-center text-[10px] text-[var(--text-muted)] pb-4">
          QPrint Analytics · Data revalidates every 5 minutes
        </footer>
      </div>
    </div>
  );
}
