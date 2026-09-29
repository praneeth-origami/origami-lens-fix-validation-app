import { STATS } from "@/lib/data";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/icons";

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-slate-400">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
            {stat.trend === "up" ? <ArrowUpIcon className="h-3 w-3" aria-hidden="true" /> : <ArrowDownIcon className="h-3 w-3" aria-hidden="true" />}
            {stat.delta} vs last month
          </p>
        </div>
      ))}
    </div>
  );
}
