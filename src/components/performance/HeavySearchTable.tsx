"use client";

import { useState } from "react";
import { generateSearchableRecords, type SearchableRecord } from "@/lib/data";

const RECORD_COUNT = 6000;
// Generated once at module load (deterministic — no Math.random), so every
// render recomputes the SAME expensive derived work over the SAME data.
const ALL_RECORDS = generateSearchableRecords(RECORD_COUNT);

/**
 * Intentionally expensive per-record scoring — a stand-in for "some
 * non-trivial derived computation a real dashboard might do" (e.g. fuzzy
 * ranking). Bounded and deterministic, but not free: recomputing it for
 * every record on every keystroke is the actual bug (see below).
 */
function relevanceScore(record: SearchableRecord, query: string): number {
  const haystack = `${record.name} ${record.email} ${record.company} ${record.plan} ${record.status}`.toLowerCase();
  if (!query) return 0;
  let score = 0;
  for (let i = 0; i < haystack.length; i++) {
    for (let j = 0; j < query.length; j++) {
      if (haystack[i] === query[j]) score += 1;
    }
  }
  return score;
}

/**
 * TEST CASE OL-006 — see TEST-CASES.md.
 *
 * `filterAndRank` below runs on EVERY render — including every keystroke in
 * the search box — over all `RECORD_COUNT` records, with no `useMemo`, no
 * debounce, and no virtualization. This is a standard, realistic React
 * performance anti-pattern (expensive derived work recomputed on every
 * render) that produces a measurable, reproducible slowdown while typing.
 */
export function HeavySearchTable() {
  const [query, setQuery] = useState("");

  // ORIGAMI-LENS-TEST: PERFORMANCE-001 — expensive, unmemoized work in the render body
  const filtered = ALL_RECORDS.filter((record) => `${record.name} ${record.email} ${record.company}`.toLowerCase().includes(query.toLowerCase()));
  const ranked = filtered
    .map((record) => ({ record, score: relevanceScore(record, query.toLowerCase()) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map((entry) => entry.record);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-sm font-medium text-slate-200">Customer directory</h2>
      <p className="mt-1 text-xs text-slate-500">
        {RECORD_COUNT.toLocaleString()} records, filtered and ranked on every keystroke — type below and watch the input lag.
      </p>
      <label htmlFor="directory-search" className="sr-only">
        Search customer directory
      </label>
      <input
        id="directory-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, or company…"
        className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th scope="col" className="pb-2 pr-4 font-medium">
                Name
              </th>
              <th scope="col" className="pb-2 pr-4 font-medium">
                Company
              </th>
              <th scope="col" className="pb-2 pr-4 font-medium">
                Plan
              </th>
              <th scope="col" className="pb-2 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ranked.map((record) => (
              <tr key={record.id}>
                <td className="py-2 pr-4 text-slate-200">{record.name}</td>
                <td className="py-2 pr-4 text-slate-400">{record.company}</td>
                <td className="py-2 pr-4 text-slate-400">{record.plan}</td>
                <td className="py-2 text-slate-400">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">Showing top {ranked.length} of {filtered.length.toLocaleString()} matches.</p>
    </div>
  );
}
