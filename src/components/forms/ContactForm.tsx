"use client";

import { useState } from "react";

/**
 * TEST CASE OL-004 — see TEST-CASES.md.
 *
 * The "Work email" field is intentionally labeled with a plain <span>
 * sitting next to it — visually it looks labeled, but the <span> has no
 * `htmlFor`/`id` relationship (or aria-labelledby) to the <input>, so it
 * has no PROGRAMMATIC accessible name. This is deliberately NOT a
 * placeholder-only input: verified empirically (see TEST-CASES.md) that a
 * placeholder alone counts as a (weak) accessible name per the browser's
 * own accessible-name computation, so axe-core does not flag it — that
 * pattern would silently fail to reproduce a real, scanner-detectable bug.
 * The "visible text sits right next to the field but isn't wired up" bug
 * below is both more realistic and something Origami Lens can genuinely
 * detect. "Full name" and "Company" (correctly) use a real
 * <label htmlFor>, so the broken pattern is visible in contrast. This is a
 * runtime DOM issue, not a static one — `npm run lint` does not flag it
 * (verified); Origami Lens is expected to find it via its own scan.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="max-w-xl rounded-xl border border-slate-800 bg-slate-950 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <h2 className="text-sm font-medium text-slate-200">Request a workspace upgrade</h2>
      <p className="mt-1 text-xs text-slate-500">Fill this in and your account team will follow up within one business day.</p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="full-name" className="mb-1 block text-sm font-medium text-slate-300">
            Full name
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
            placeholder="Jordan Rivera"
          />
        </div>

        <div>
          {/* ORIGAMI-LENS-TEST: ACCESSIBILITY-003 — visible text, but not programmatically associated with the input (no htmlFor/id, no aria-labelledby) */}
          <span className="mb-1 block text-sm font-medium text-slate-300">Work email</span>
          {/* No placeholder here deliberately — a placeholder is itself a (weak) fallback accessible name per the browser's accname computation, which would mask this exact bug. */}
          <input
            name="workEmail"
            type="email"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-slate-300">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <button type="submit" className="mt-5 w-full rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white hover:bg-indigo-400">
        Submit request
      </button>

      {submitted && (
        <p role="status" className="mt-3 text-sm text-emerald-400">
          Thanks — your request has been submitted.
        </p>
      )}
    </form>
  );
}
