"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { AccessibilityIcon, BellIcon, DeviceIcon, FormIcon, GaugeIcon, HomeIcon, MoonIcon, SearchIcon, SunIcon, TerminalIcon } from "@/components/icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/accessibility", label: "Accessibility", icon: AccessibilityIcon },
  { href: "/forms", label: "Forms", icon: FormIcon },
  { href: "/responsive", label: "Responsive", icon: DeviceIcon },
  { href: "/console", label: "Console", icon: TerminalIcon },
  { href: "/performance", label: "Performance", icon: GaugeIcon },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-slate-300 hover:bg-slate-900 md:hidden"
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>

        <form role="search" className="hidden flex-1 max-w-md items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 sm:flex" onSubmit={(e) => e.preventDefault()}>
          <SearchIcon className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <input
            id="global-search"
            type="search"
            placeholder="Search repositories, issues, people…"
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-2 text-slate-300 hover:bg-slate-900"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <MoonIcon className="h-5 w-5" aria-hidden="true" /> : <SunIcon className="h-5 w-5" aria-hidden="true" />}
          </button>
          <button type="button" className="relative rounded-md p-2 text-slate-300 hover:bg-slate-900" aria-label="View notifications (3 unread)">
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav aria-label="Mobile" className="mt-3 flex flex-col gap-1 md:hidden">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-indigo-500/10 text-indigo-300" : "text-slate-300 hover:bg-slate-900"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
