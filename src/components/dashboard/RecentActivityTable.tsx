import { RECENT_ACTIVITY } from "@/lib/data";

/**
 * Deliberately CLEAN and responsive — contrast case for OL-003, which lives
 * in a separate component (AnalyticsTable) with a different data shape.
 * Wrapping in `overflow-x-auto` is the correct pattern; see
 * src/components/responsive/AnalyticsTable.tsx for the intentionally
 * broken version.
 */
export function RecentActivityTable() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-sm font-medium text-slate-200">Recent activity</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th scope="col" className="pb-2 font-medium">
                User
              </th>
              <th scope="col" className="pb-2 font-medium">
                Action
              </th>
              <th scope="col" className="pb-2 font-medium">
                When
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {RECENT_ACTIVITY.map((row) => (
              <tr key={row.id}>
                <td className="py-2 pr-4 text-slate-200">{row.user}</td>
                <td className="py-2 pr-4 text-slate-400">
                  {row.action} <span className="text-slate-200">{row.target}</span>
                </td>
                <td className="py-2 text-slate-500">{row.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
