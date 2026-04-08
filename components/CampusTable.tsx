interface CampusRow {
  college_name: string;
  shops_count:  number;
  jobs_completed: number;
  revenue: number;
}

interface CampusTableProps {
  campuses: CampusRow[];
}

const RANK_STYLES = [
  { bg: "bg-amber-100",   text: "text-amber-700",   ring: "ring-amber-300"   },
  { bg: "bg-slate-100",   text: "text-slate-600",   ring: "ring-slate-300"   },
  { bg: "bg-orange-100",  text: "text-orange-600",  ring: "ring-orange-300"  },
];

export function CampusTable({ campuses }: CampusTableProps) {
  const totalJobs = campuses.reduce((s, c) => s + c.jobs_completed, 0) || 1;
  const sorted = [...campuses].sort((a, b) => b.jobs_completed - a.jobs_completed);

  return (
    <div className="glass animate-in p-6" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p
            className="text-base font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Campus Breakdown
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Performance across all registered campuses
          </p>
        </div>
        <span className="text-[10px] px-3 py-1.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-semibold">
          {campuses.length} campuses
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {["#", "Campus", "Shops", "Jobs", "Revenue", "Share"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[9px] uppercase tracking-widest text-[var(--text-muted)] pb-3 px-3 font-semibold border-b border-[var(--border)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const share = Math.round((row.jobs_completed / totalJobs) * 100);
              const rank = RANK_STYLES[i] ?? { bg: "bg-violet-50", text: "text-violet-500", ring: "ring-violet-200" };

              return (
                <tr
                  key={row.college_name}
                  className="group transition-colors duration-150 hover:bg-[var(--accent-soft)]"
                >
                  {/* Rank */}
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ring-1 ${rank.bg} ${rank.text} ${rank.ring}`}
                    >
                      {i + 1}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-3 py-3.5">
                    <span
                      className="font-medium text-[var(--text-primary)] text-sm"
                      style={{ fontFamily: "var(--font-jakarta)" }}
                    >
                      {row.college_name}
                    </span>
                  </td>

                  {/* Shops */}
                  <td className="px-3 py-3.5">
                    <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-sky-50 text-sky-600">
                      {row.shops_count} shops
                    </span>
                  </td>

                  {/* Jobs */}
                  <td className="px-3 py-3.5 text-[var(--text-secondary)] text-sm font-medium">
                    {row.jobs_completed.toLocaleString()}
                  </td>

                  {/* Revenue */}
                  <td className="px-3 py-3.5">
                    <span className="text-sm font-semibold text-amber-600">
                      ₹{(row.revenue / 100000).toFixed(2)}L
                    </span>
                  </td>

                  {/* Share bar */}
                  <td className="px-3 py-3.5 min-w-[140px]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 h-2 rounded-full bg-violet-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${share}%`,
                            background: "linear-gradient(90deg, #7c6ff7, #a78bfa)",
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--text-secondary)] w-7 text-right">
                        {share}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
