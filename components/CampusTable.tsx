interface CampusRow {
  college_name: string;
  shops_count: number;
  jobs_completed: number;
  revenue: number;
}

interface CampusTableProps {
  campuses: CampusRow[];
}

export function CampusTable({ campuses }: CampusTableProps) {
  const totalJobs = campuses.reduce((s, c) => s + c.jobs_completed, 0) || 1;

  return (
    <div className="bg-[#0f0f23] border border-[#312e81] rounded-xl p-4">
      <p className="text-sm font-semibold text-indigo-200 mb-4">Campus Comparison</p>
      <table className="w-full text-xs">
        <thead>
          <tr>
            {["Campus", "Shops", "Jobs Done", "Revenue", "Share"].map((h) => (
              <th key={h} className="text-left text-[9px] uppercase tracking-wide text-gray-500 pb-2 px-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campuses.map((row, i) => {
            const share = Math.round((row.jobs_completed / totalJobs) * 100);
            return (
              <tr key={row.college_name} className={i % 2 === 1 ? "bg-[#0d0d1a]" : ""}>
                <td className="px-2 py-2 text-indigo-200">{row.college_name}</td>
                <td className="px-2 py-2 text-right text-gray-400">{row.shops_count}</td>
                <td className="px-2 py-2 text-right text-gray-400">{row.jobs_completed.toLocaleString()}</td>
                <td className="px-2 py-2 text-right text-yellow-400">
                  ₹{(row.revenue / 100000).toFixed(2)}L
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-indigo-600 rounded" style={{ width: `${share}%`, minWidth: 4 }} />
                    <span className="text-gray-500 text-[9px]">{share}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
