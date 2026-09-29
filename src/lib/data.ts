// Deterministic, hand-authored mock data — no backend, no network calls.
// Realistic enough for a SaaS dashboard demo without pulling in a fixtures library.

export interface StatDatum {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

export const STATS: StatDatum[] = [
  { id: "revenue", label: "Monthly Revenue", value: "$48,290", delta: "+12.4%", trend: "up" },
  { id: "users", label: "Active Users", value: "3,482", delta: "+4.1%", trend: "up" },
  { id: "sessions", label: "Active Sessions", value: "912", delta: "-2.3%", trend: "down" },
  { id: "conversion", label: "Conversion Rate", value: "6.8%", delta: "+0.6%", trend: "up" },
];

export interface ActivityRow {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export const RECENT_ACTIVITY: ActivityRow[] = [
  { id: "a1", user: "Priya Sharma", action: "created", target: "Repository scan #4821", timestamp: "2 minutes ago" },
  { id: "a2", user: "Marcus Lee", action: "resolved", target: "Issue OL-014", timestamp: "18 minutes ago" },
  { id: "a3", user: "Ava Torres", action: "invited", target: "dana@example.com", timestamp: "1 hour ago" },
  { id: "a4", user: "Noah Kim", action: "updated", target: "Billing plan to Team", timestamp: "3 hours ago" },
  { id: "a5", user: "Priya Sharma", action: "merged", target: "PR #219 ai-fix/OL-011", timestamp: "5 hours ago" },
];

export interface AnalyticsRow {
  id: string;
  page: string;
  visitors: number;
  avgTime: string;
  bounceRate: string;
  conversions: number;
  revenue: string;
  device: string;
  region: string;
}

// Deliberately WIDE dataset (many columns) — see AnalyticsTable.tsx
// (ORIGAMI-LENS-TEST: MOBILE-001) for why this is rendered without a
// responsive wrapper.
export const ANALYTICS_ROWS: AnalyticsRow[] = [
  { id: "p1", page: "/pricing", visitors: 12480, avgTime: "2m 14s", bounceRate: "34%", conversions: 812, revenue: "$18,240", device: "Desktop", region: "North America" },
  { id: "p2", page: "/dashboard", visitors: 9820, avgTime: "5m 02s", bounceRate: "21%", conversions: 1204, revenue: "$0", device: "Desktop", region: "Europe" },
  { id: "p3", page: "/onboarding", visitors: 7310, avgTime: "3m 48s", bounceRate: "29%", conversions: 654, revenue: "$0", device: "Mobile", region: "Asia Pacific" },
  { id: "p4", page: "/repositories", visitors: 5120, avgTime: "6m 33s", bounceRate: "18%", conversions: 441, revenue: "$0", device: "Desktop", region: "North America" },
  { id: "p5", page: "/settings/billing", visitors: 3040, avgTime: "1m 51s", bounceRate: "41%", conversions: 288, revenue: "$9,860", device: "Mobile", region: "Europe" },
];

export interface SearchableRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: string;
}

const FIRST_NAMES = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Jamie", "Drew", "Cameron"];
const LAST_NAMES = ["Nguyen", "Patel", "Garcia", "Smith", "Johnson", "Kim", "Rossi", "Muller", "Ivanov", "Chen"];
const COMPANIES = ["Acme Corp", "Globex", "Initech", "Umbrella", "Soylent", "Stark Industries", "Wayne Enterprises", "Hooli", "Wonka Inc", "Pied Piper"];
const PLANS = ["Free", "Pro", "Team", "Enterprise"];
const STATUSES = ["Active", "Trialing", "Past Due", "Cancelled"];

/**
 * A larger, deterministically-generated dataset for the performance test
 * page (ORIGAMI-LENS-TEST: PERFORMANCE-001) — deterministic (no Math.random)
 * so repeated scans see the exact same data and the same measurable
 * slowdown every time.
 */
export function generateSearchableRecords(count: number): SearchableRecord[] {
  const records: SearchableRecord[] = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const company = COMPANIES[(i * 3) % COMPANIES.length];
    records.push({
      id: `rec-${i}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      company,
      plan: PLANS[i % PLANS.length],
      status: STATUSES[(i * 5) % STATUSES.length],
    });
  }
  return records;
}
