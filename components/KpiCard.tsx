interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: "green" | "yellow" | "pink" | "default";
}

export function KpiCard({ label, value, sub, highlight = "default" }: KpiCardProps) {
  const colorMap = {
    green:   "text-green-400",
    yellow:  "text-yellow-400",
    pink:    "text-pink-400",
    default: "text-indigo-300",
  };
  return (
    <div className="bg-[#0f0f23] border border-[#312e81] rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[highlight]}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
