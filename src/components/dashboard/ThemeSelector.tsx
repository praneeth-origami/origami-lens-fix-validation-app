"use client";

import { useTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "@/components/icons";

/**
 * TEST CASE OL-001 — see TEST-CASES.md.
 *
 * The "Light" option below is intentionally missing an accessible name:
 * it renders only an icon, with no aria-label/aria-labelledby and no
 * visible text content, so assistive technology has no way to announce
 * what the button does. The "Dark" option (correctly) has one, so a
 * scanner/reviewer can see the contrast between the broken and working
 * pattern side by side.
 *
 * This is a runtime DOM issue, not a static one: `npm run lint` does not
 * flag it (verified). Origami Lens is expected to find it via its own
 * browser-based (axe-core) scan, exactly as a real accessibility bug would
 * only surface in the rendered page.
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-sm font-medium text-slate-200">Appearance</h2>
      <p className="mt-1 text-xs text-slate-500">Choose how the Origami Lens Test Dashboard looks on this device.</p>
      <div className="mt-4 flex gap-2" role="group" aria-label="Theme">
        {/* ORIGAMI-LENS-TEST: ACCESSIBILITY-001 — button has no accessible name */}
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`theme-option flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
            theme === "light" ? "active border-indigo-400 bg-indigo-500/10 text-indigo-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"
          }`}
        >
          <SunIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-label="Dark theme"
          className={`theme-option flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
            theme === "dark" ? "active border-indigo-400 bg-indigo-500/10 text-indigo-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"
          }`}
        >
          <MoonIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
