import Link from "next/link";
import { PageHeading } from "@/components/layout/AppShell";
import { ChevronRightIcon } from "@/components/icons";

const CASES = [
  {
    id: "OL-001",
    title: "Theme selector button has no accessible name",
    location: "Dashboard → Appearance card",
    href: "/",
  },
  {
    id: "OL-002",
    title: "Profile avatar image has no alt text",
    location: "Dashboard → Your profile card",
    href: "/",
  },
  {
    id: "OL-004",
    title: "Work email field has no associated label",
    location: "Forms → Request a workspace upgrade",
    href: "/forms",
  },
];

/**
 * This page intentionally only DESCRIBES and LINKS to where each
 * accessibility test case actually lives — it does not re-render the same
 * buggy components a second time. Duplicating the same DOM element in two
 * places would give Origami Lens's source-grounding two equally-plausible
 * places to point a fix at, which defeats the point of this test app (see
 * TEST-CASES.md's "Source grounding" section).
 */
export default function AccessibilityPage() {
  return (
    <>
      <PageHeading title="Accessibility test cases" description="Where each intentional accessibility issue lives in this app — see TEST-CASES.md for full detail." />
      <div className="max-w-2xl space-y-3">
        {CASES.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-indigo-500/50"
          >
            <div>
              <p className="text-xs font-mono text-indigo-400">{item.id}</p>
              <p className="mt-1 text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs opacity-60">{item.location}</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </>
  );
}
