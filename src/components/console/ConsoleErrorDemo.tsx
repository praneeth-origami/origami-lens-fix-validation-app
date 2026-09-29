"use client";

import { useState } from "react";

const CORRUPTED_CACHE_KEY = "ol-extended-profile-cache";

/**
 * TEST CASE OL-005 — see TEST-CASES.md.
 *
 * Clicking "Load extended profile" seeds localStorage with a deliberately
 * malformed JSON payload and then parses it, producing a real
 * `console.error` — the kind of bug that happens when a cached payload
 * gets corrupted. The error is caught (the app does not crash); only the
 * console output and the on-screen status change.
 */
export function ConsoleErrorDemo() {
  const [profileStatus, setProfileStatus] = useState<"idle" | "loaded" | "error">("idle");
  const [networkStatus, setNetworkStatus] = useState<"idle" | "checked">("idle");

  function handleLoadExtendedProfile() {
    // ORIGAMI-LENS-TEST: CONSOLE-001 — intentionally malformed cached payload
    window.localStorage.setItem(CORRUPTED_CACHE_KEY, "{ invalid json, truncated");
    const raw = window.localStorage.getItem(CORRUPTED_CACHE_KEY);
    try {
      JSON.parse(raw ?? "");
      setProfileStatus("loaded");
    } catch (error) {
      // Deliberately caught, not rethrown — a real app degrades gracefully
      // here instead of crashing. This is the exact scenario documented in
      // TEST-CASES.md: a genuine console.error, triggered only by this
      // button, that never brings down the page.
      console.error("[origami-lens-test] Failed to parse cached extended-profile payload:", error);
      setProfileStatus("error");
    }
  }

  async function handlePingUnavailableService() {
    // A real failed network request (404) the browser will log — no mock,
    // no fake response, just a request to a route this app never defines.
    await fetch("/api/does-not-exist").catch(() => undefined);
    setNetworkStatus("checked");
  }

  return (
    <div className="max-w-xl space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-6">
      <div>
        <h2 className="text-sm font-medium text-slate-200">Extended profile cache</h2>
        <p className="mt-1 text-xs text-slate-500">Simulates loading a cached profile payload that has become corrupted.</p>
        <button
          type="button"
          onClick={handleLoadExtendedProfile}
          className="mt-3 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Load extended profile
        </button>
        {profileStatus === "error" && (
          <p role="status" className="mt-2 text-sm text-rose-400">
            Could not load extended profile — check the console for details.
          </p>
        )}
        {profileStatus === "loaded" && (
          <p role="status" className="mt-2 text-sm text-emerald-400">
            Extended profile loaded.
          </p>
        )}
      </div>

      <div className="border-t border-slate-800 pt-4">
        <h2 className="text-sm font-medium text-slate-200">Background sync check</h2>
        <p className="mt-1 text-xs text-slate-500">Pings a status endpoint that does not exist, to exercise network-error monitoring.</p>
        <button
          type="button"
          onClick={handlePingUnavailableService}
          className="mt-3 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900"
        >
          Run background sync check
        </button>
        {networkStatus === "checked" && <p className="mt-2 text-sm text-slate-400">Request sent — check the Network tab.</p>}
      </div>
    </div>
  );
}
