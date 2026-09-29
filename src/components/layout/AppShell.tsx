"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useTheme } from "@/lib/theme";

/**
 * The nav chrome (Sidebar/Header) is always dark, a common "dark chrome,
 * themeable canvas" pattern — the theme toggle changes the main content
 * area's background/text so the interaction is visibly, testably real.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className={`flex-1 px-4 py-6 transition-colors sm:px-6 lg:px-8 ${theme === "light" ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-slate-100"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm opacity-70">{description}</p>
    </div>
  );
}
