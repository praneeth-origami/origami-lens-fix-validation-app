# TEST-CASES.md

This repository exists to validate the full Origami Lens workflow end to end:

```
SCAN → ISSUE DETECTION → AI FIX GENERATION → SOURCE GROUNDING → FIX PROPOSAL
  → GITHUB BRANCH → COMMIT → PULL REQUEST → MERGE → PULL LATEST CODE
  → RUN APPLICATION → FRESH ORIGAMI LENS SCAN → VERIFY ISSUE IS FIXED
```

Every issue below is a **real bug in real source code** — there are no mock
issues, no fake scan results, and no hardcoded "fixed" responses anywhere in
this repository. Origami Lens must find each one through its own browser
scan (DOM analysis, `axe-core`, console/network monitoring, screenshots),
and a fix is only "done" once a fresh scan genuinely stops reporting it (see
`docs/VALIDATION.md`).

Every intentional bug is marked in source with a comment of the form
`ORIGAMI-LENS-TEST: <MARKER-ID>`, so its exact location is unambiguous. These
comments are for locating test cases only — they carry no runtime meaning
and are never shown in the UI.

## Summary table

| ID | Category | Page | File | Expected Issue | Expected Fix | Verification |
|----|----------|------|------|----------------|--------------|---------------|
| OL-001 | Accessibility | `/` (Dashboard) | `src/components/dashboard/ThemeSelector.tsx` | "Light theme" button has no accessible name (icon-only, no text/aria-label) | Add `aria-label="Light theme"` to the button | axe `button-name` rule; `src/components/dashboard/ThemeSelector.a11y.test.tsx` |
| OL-002 | Accessibility | `/` (Dashboard) | `src/components/dashboard/ProfileCard.tsx` | Avatar `<img>` has no `alt` attribute | Add a descriptive `alt` (e.g. `alt="Dana Whitfield's avatar"`) | axe `image-alt` rule; `src/components/dashboard/ProfileCard.a11y.test.tsx` |
| OL-003 | Mobile / Responsive | `/responsive` | `src/components/responsive/AnalyticsTable.tsx` | Table forces horizontal page scroll on mobile viewports (fixed `min-width`, no `overflow-x-auto` wrapper) | Wrap the `<table>` in a scrollable container (e.g. `<div className="overflow-x-auto">`), matching `RecentActivityTable.tsx`'s pattern | Manual/Origami Lens layout scan at a mobile viewport width (≤ 480px); see `docs/VALIDATION.md` |
| OL-004 | Accessibility (Forms) | `/forms` | `src/components/forms/ContactForm.tsx` | "Work email" input has visible label text next to it, but no programmatic association (no `htmlFor`/`id`, no `aria-labelledby`) | Add `id="work-email"` to the input and `htmlFor="work-email"` to the `<span>` (or convert it to a real `<label>`) | axe `label` rule; `src/components/forms/ContactForm.a11y.test.tsx` |
| OL-005 | Console / Network | `/console` | `src/components/console/ConsoleErrorDemo.tsx` | Clicking "Load extended profile" logs a real `console.error` (corrupted cached JSON payload) without crashing the app | Validate/guard the cached payload before parsing (or repair the cache-writing path so it never stores malformed JSON) | Manual: open DevTools console, click the button; `src/components/console/ConsoleErrorDemo.test.tsx` asserts the exact `console.error` call |
| OL-006 | Performance | `/performance` | `src/components/performance/HeavySearchTable.tsx` | Search input recomputes an expensive filter+rank over 6,000 records on every keystroke, with no `useMemo`/debounce — measurable input lag | Wrap the derived `filtered`/`ranked` computation in `useMemo` keyed on `query`, and/or debounce the search input | Manual: type in the search box and observe input lag / a DevTools Performance long-task recording; see `docs/VALIDATION.md` |

---

## TEST CASE OL-001 — THEME SELECTOR BUTTON HAS NO ACCESSIBLE NAME

**File:** `src/components/dashboard/ThemeSelector.tsx`
**Marker:** `ORIGAMI-LENS-TEST: ACCESSIBILITY-001`
**Page:** `/` (Dashboard) → "Appearance" card

**Current (buggy) code:**

```tsx
<button
  type="button"
  onClick={() => setTheme("light")}
  className="theme-option ..."
>
  <SunIcon className="h-5 w-5" />
</button>
```

**Expected issue:** Button does not have an accessible name — it renders
only an icon (`<svg>`), with no visible text, no `aria-label`, and no
`aria-labelledby`. Screen reader users hear "button" with no indication of
what it does. (Contrast with the adjacent "Dark theme" button, which
correctly has `aria-label="Dark theme"`.)

**Expected fix:**

```tsx
<button
  type="button"
  onClick={() => setTheme("light")}
  aria-label="Light theme"
  className="theme-option ..."
>
  <SunIcon className="h-5 w-5" />
</button>
```

**Expected Origami Lens result:** **HIGH confidence source grounding.**
DOM evidence (`button.theme-option`, no accessible name, icon child) maps
onto exactly one component, with no duplicate/ambiguous candidates
elsewhere in the repository — see "Source grounding" below.

---

## TEST CASE OL-002 — IMAGE ACCESSIBILITY

**File:** `src/components/dashboard/ProfileCard.tsx`
**Marker:** `ORIGAMI-LENS-TEST: ACCESSIBILITY-002`
**Page:** `/` (Dashboard) → "Your profile" card

**Current (buggy) code:**

```tsx
<img
  src="/avatar-placeholder.svg"
  className="h-14 w-14 rounded-full border border-slate-800 bg-slate-900"
  width={56}
  height={56}
/>
```

**Expected issue:** Image element missing accessible alternative text
(`alt`). A plain `<img>` is used deliberately instead of `next/image` —
`next/image`'s `alt` prop is `string`-required by its TypeScript types,
which would make this exact bug impossible to express with that component.

**Expected fix:**

```tsx
<img
  src="/avatar-placeholder.svg"
  alt="Dana Whitfield's avatar"
  className="h-14 w-14 rounded-full border border-slate-800 bg-slate-900"
  width={56}
  height={56}
/>
```

**Note:** `npm run lint` reports one *unrelated, expected* warning on this
line (`@next/next/no-img-element` — a performance suggestion to use
`next/image`). That is not this bug and does not fail the lint script.

---

## TEST CASE OL-003 — MOBILE OVERFLOW

**File:** `src/components/responsive/AnalyticsTable.tsx`
**Marker:** `ORIGAMI-LENS-TEST: MOBILE-001`
**Page:** `/responsive`

**Current (buggy) code:**

```tsx
<table className="mt-4 min-w-[1100px] text-left text-sm">
  ...
</table>
```

The table is NOT wrapped in an `overflow-x-auto` container, and has a
fixed `min-width` (1100px) far wider than a typical mobile viewport
(375–480px). Contrast this with the correct pattern already used in
`src/components/dashboard/RecentActivityTable.tsx`:

```tsx
<div className="mt-4 overflow-x-auto">
  <table className="w-full min-w-[420px] text-left text-sm">...</table>
</div>
```

**Expected issue:** Horizontal scrolling / content overflow — at a mobile
viewport width, the whole *page* scrolls horizontally instead of just the
table scrolling within its own bounded area.

**Expected fix:** Wrap the `<table>` in `<div className="overflow-x-auto">`,
matching `RecentActivityTable.tsx`.

---

## TEST CASE OL-004 — FORM ACCESSIBILITY

**File:** `src/components/forms/ContactForm.tsx`
**Marker:** `ORIGAMI-LENS-TEST: ACCESSIBILITY-003`
**Page:** `/forms`

**Current (buggy) code:**

```tsx
<div>
  <span className="mb-1 block text-sm font-medium text-slate-300">Work email</span>
  <input
    name="workEmail"
    type="email"
    required
    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
  />
</div>
```

**Expected issue:** Form control does not have an accessible name. The
"Work email" text is visually right above the field, so a sighted user
reads it as a label — but it is a plain `<span>` with no `htmlFor`/`id`
relationship (and no `aria-labelledby`) to the `<input>`, so nothing
connects them in the accessibility tree.

**Why this isn't a placeholder-based example:** an earlier draft of this
test case used `placeholder="Work email"` on the bare input with no
`<span>`. That was empirically verified (via `jest-axe`) to **not** be
flagged by axe-core's `label` rule — a `placeholder` counts as a weak
fallback accessible name per the browser's own accessible-name
computation. Using it would have silently produced a bug that Origami
Lens's real axe-core-based scan could never actually detect, defeating the
purpose of this test project. The "visible-but-unassociated label text"
version above is both more realistic (a very common real-world mistake)
and genuinely scanner-detectable — confirmed via
`ContactForm.a11y.test.tsx`.

**Expected fix:**

```tsx
<div>
  <label htmlFor="work-email" className="mb-1 block text-sm font-medium text-slate-300">
    Work email
  </label>
  <input
    id="work-email"
    name="workEmail"
    type="email"
    required
    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
  />
</div>
```

---

## TEST CASE OL-005 — CONSOLE ERROR

**File:** `src/components/console/ConsoleErrorDemo.tsx`
**Marker:** `ORIGAMI-LENS-TEST: CONSOLE-001`
**Page:** `/console`

**How to trigger it:** open the browser DevTools console, go to `/console`,
and click **"Load extended profile"**.

**What happens:** the button handler seeds `localStorage` with a
deliberately malformed JSON string (`"{ invalid json, truncated"`), then
calls `JSON.parse` on it. The resulting `SyntaxError` is caught (the
component does **not** crash — the page keeps working normally) and logged
via:

```ts
console.error("[origami-lens-test] Failed to parse cached extended-profile payload:", error);
```

The on-screen status also changes to "Could not load extended profile —
check the console for details." so the trigger is visually confirmable,
not just a console side effect.

A second button, **"Run background sync check"**, fires a real failed
network request (`fetch("/api/does-not-exist")`, a route this app never
defines — a genuine 404, not a mock) to exercise network-error monitoring
as well.

**Expected issue:** a genuine, reproducible `console.error`, scoped to this
one user action — never a permanent/uncontrolled crash.

**Expected fix:** validate the cached payload before parsing it (e.g. a
`try/catch` around the read path that falls back to re-fetching, or a
schema check before writing to the cache in the first place), so a
corrupted cache entry degrades gracefully without ever reaching
`console.error`.

---

## TEST CASE OL-006 — PERFORMANCE

**File:** `src/components/performance/HeavySearchTable.tsx`
**Marker:** `ORIGAMI-LENS-TEST: PERFORMANCE-001`
**Page:** `/performance`

**Current (buggy) code (simplified):**

```tsx
export function HeavySearchTable() {
  const [query, setQuery] = useState("");

  // Runs on EVERY render — including every keystroke — over 6,000 records.
  const filtered = ALL_RECORDS.filter((r) => matches(r, query));
  const ranked = filtered.map((r) => ({ r, score: relevanceScore(r, query) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
  ...
}
```

`ALL_RECORDS` is a deterministic, module-level array of 6,000 generated
records (no `Math.random`, so the exact same computation reruns identically
on every scan). `relevanceScore` does a nested-loop character comparison
per record. None of this is memoized, and the search input has no
debounce, so **every keystroke** re-runs the full filter + rank + sort over
all 6,000 records synchronously in the render body.

**Expected issue:** measurable, reproducible input lag while typing in the
"Search customer directory" field on `/performance` — visible as a long
task in a DevTools Performance recording, or as a Lighthouse/Origami Lens
performance warning about excessive main-thread work.

**Expected fix:** wrap the derived `filtered`/`ranked` computation in
`useMemo(() => ..., [query])`, and/or debounce `query` before it drives the
computation (e.g. only recompute after the user stops typing for ~150ms).

**Keeping it controlled:** the dataset size (6,000) and algorithm are fixed
and bounded — this produces a measurable slowdown per keystroke, never an
unbounded loop or a frozen page.

---

## Source grounding

For every fixable issue above:

1. **The DOM selector is specific** — e.g. `button.theme-option` (OL-001),
   the avatar `img` inside `.rounded-full` (OL-002), the single unlabeled
   `input[name="workEmail"]` (OL-004).
2. **The relevant source component is unambiguous** — each bug lives in
   exactly one component, used in exactly one place in the app. Nothing
   duplicates `ThemeSelector`, `ProfileCard`, or `ContactForm` elsewhere.
3. **The issue maps directly to one source file** — see the table above.
4. **The expected fix is localized** — a one- or two-line change per case
   (an `aria-label`, an `alt`, an `id`/`htmlFor` pair, an `overflow-x-auto`
   wrapper, a `useMemo`), never a rewrite.
5. **No duplicate components exist that could confuse source retrieval** —
   `/accessibility` deliberately only *links to* where OL-001/002/004 live
   rather than re-rendering the same buggy markup a second time (see that
   page's own comment). `RecentActivityTable` (clean) and `AnalyticsTable`
   (OL-003) are intentionally different components with different data, not
   two copies of the same one.

This is exactly the pipeline this project exists to exercise:

```
DOM evidence → source search → BGE-M3 → reranker → source grounding
  → Qwen code fix → patch → syntax validation
```

## A note on what "detectable" actually means here

Two of these test cases (OL-001, OL-004) were adjusted during development
after **actually running `jest-axe` against the components** and finding
that an initial, more "obvious-looking" version of the bug was not flagged
by axe-core (see OL-004's write-up above for the concrete example). This is
deliberate and left documented here: an issue that *looks* wrong to a human
but that a real scanner cannot detect would make this project useless for
its actual purpose. Every issue in this file was verified against the real
`axe-core` engine (the same one Origami Lens's browser worker runs), not
assumed.
