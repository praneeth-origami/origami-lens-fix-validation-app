import { ANALYTICS_ROWS } from "@/lib/data";

/**
 * TEST CASE OL-003 — see TEST-CASES.md.
 *
 * Intentionally NOT wrapped in an `overflow-x-auto` container, and given a
 * fixed `min-width` wider than a typical mobile viewport — so on a small
 * screen the table forces the whole page to scroll horizontally instead of
 * the table scrolling within its own bounded area. Contrast this with
 * src/components/dashboard/RecentActivityTable.tsx, which uses the correct
 * pattern.
 */
export function AnalyticsTable() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-sm font-medium text-slate-200">Page analytics</h2>
      <p className="mt-1 text-xs text-slate-500">Last 30 days, all traffic sources.</p>

      {/* ORIGAMI-LENS-TEST: MOBILE-001 — no overflow-x-auto wrapper, fixed min-width wider than the viewport */}
      <table className="mt-4 min-w-[1100px] text-left text-sm">
        <thead>
          <tr className="text-slate-500">
            <th scope="col" className="pb-2 pr-6 font-medium">
              Page
            </th>
            <th scope="col" className="pb-2 pr-6 font-medium">
              Visitors
            </th>
            <th scope="col" className="pb-2 pr-6 font-medium">
              Avg. time
            </th>
            <th scope="col" className="pb-2 pr-6 font-medium">
              Bounce rate
            </th>
            <th scope="col" className="pb-2 pr-6 font-medium">
              Conversions
            </th>
            <th scope="col" className="pb-2 pr-6 font-medium">
              Revenue
            </th>
            <th scope="col" className="pb-2 pr-6 font-medium">
              Top device
            </th>
            <th scope="col" className="pb-2 font-medium">
              Top region
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {ANALYTICS_ROWS.map((row) => (
            <tr key={row.id}>
              <td className="py-2 pr-6 text-slate-200">{row.page}</td>
              <td className="py-2 pr-6 text-slate-400">{row.visitors.toLocaleString()}</td>
              <td className="py-2 pr-6 text-slate-400">{row.avgTime}</td>
              <td className="py-2 pr-6 text-slate-400">{row.bounceRate}</td>
              <td className="py-2 pr-6 text-slate-400">{row.conversions}</td>
              <td className="py-2 pr-6 text-slate-400">{row.revenue}</td>
              <td className="py-2 pr-6 text-slate-400">{row.device}</td>
              <td className="py-2 text-slate-400">{row.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
