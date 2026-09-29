"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccessibilityIcon, DeviceIcon, FormIcon, GaugeIcon, HomeIcon, TerminalIcon } from "@/components/icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/accessibility", label: "Accessibility", icon: AccessibilityIcon },
  { href: "/forms", label: "Forms", icon: FormIcon },
  { href: "/responsive", label: "Responsive", icon: DeviceIcon },
  { href: "/console", label: "Console", icon: TerminalIcon },
  { href: "/performance", label: "Performance", icon: GaugeIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6 text-slate-300 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-semibold text-white">OL</div>
        <span className="text-sm font-semibold text-white">Origami Lens Test</span>
      </div>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-indigo-500/10 text-indigo-300" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-lg bg-slate-900 p-3 text-xs text-slate-400">
        <p className="font-medium text-slate-200">origami-lens-fix-validation-app</p>
        <p className="mt-1">A test bed for the Origami Lens scan → fix → PR workflow.</p>
      </div>
    </aside>
  );
}
