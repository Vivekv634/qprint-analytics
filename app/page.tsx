import { getDb } from "@/lib/mongodb";
import { getSummary, getTrends, getPeakHours, getCampuses } from "@/lib/db/analytics";
import { KpiCard } from "@/components/KpiCard";
import { TrendsChart } from "@/components/TrendsChart";
import { PeakHoursBar } from "@/components/PeakHoursBar";
import { CampusTable } from "@/components/CampusTable";

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

export const revalidate = 300; // ISR: revalidate every 5 minutes

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
    <main className="min-h-screen bg-[#0d0d1a] text-white p-6 font-sans">
      {/* Nav */}
      <div className="flex items-center justify-between mb-6 bg-[#0f0f23] border border-[#312e81] rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center font-bold text-sm">Q</div>
          <span className="font-bold text-indigo-200">q-print analytics</span>
          <span className="text-[10px] text-gray-500 bg-[#1e1b4b] px-2 py-0.5 rounded">
            live · updates on every shop sync
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">All-time totals</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Jobs Done"    value={summary.total_jobs.toLocaleString()} />
        <KpiCard label="Files Printed" value={summary.total_files.toLocaleString()} />
        <KpiCard label="Color Pages"  value={summary.total_pages_color.toLocaleString()} highlight="pink" />
        <KpiCard label="B&W Pages"    value={summary.total_pages_bw.toLocaleString()} />
        <KpiCard label="Revenue"      value={`₹${(summary.total_revenue / 100000).toFixed(2)}L`} highlight="yellow" />
        <KpiCard label="Success Rate" value={`${summary.success_rate}%`} highlight="green" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <TrendsChart data30={trends30} data7={trends7} data90={trends90} />
        </div>
        <PeakHoursBar hours={peakHoursData} />
      </div>

      {/* Campus table */}
      <CampusTable campuses={campuses} />
    </main>
  );
}
