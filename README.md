# origami-lens-fix-validation-app

A small, realistic Next.js SaaS dashboard whose only job is to be a genuine
end-to-end test bed for the **Origami Lens** scan → fix → PR workflow:

```
SCAN → ISSUE DETECTION → AI FIX GENERATION → SOURCE GROUNDING → FIX PROPOSAL
  → GITHUB BRANCH → COMMIT → PULL REQUEST → MERGE → PULL LATEST CODE
  → RUN APPLICATION → FRESH ORIGAMI LENS SCAN → VERIFY ISSUE IS FIXED
```

This is **not** a mocked demo. It contains real, intentional bugs in real
source files, and the only way to "pass" is for Origami Lens to actually
detect them through its normal browser-based scan, actually propose a
grounded fix, actually open and merge a real PR, and have a genuinely
fresh scan afterward stop reporting the issue.

> **This project does not modify Origami Lens itself.** It is an external,
> standalone application meant to be scanned by it.

## 1. Project purpose

Origami Lens's own repository has unit and integration tests for its scan
pipeline, its AI fix-generation pipeline, and its GitHub PR workflow in
isolation. What it doesn't have is a realistic *target* application to run
the whole pipeline against, end to end, against real bugs whose fix is
known in advance. That's what this repository is for.

## 2. Architecture

A single Next.js App Router application, no backend/database, no external
API dependency beyond what Next.js itself needs:

```
src/
  app/                     — one route per test area (see "Pages" below)
  components/
    layout/                — Header, Sidebar, AppShell (page chrome)
    dashboard/              — StatsGrid, ThemeSelector (OL-001), ProfileCard (OL-002), RecentActivityTable
    forms/                  — ContactForm (OL-004)
    responsive/             — AnalyticsTable (OL-003)
    console/                — ConsoleErrorDemo (OL-005)
    performance/            — HeavySearchTable (OL-006)
    icons.tsx               — small inline SVG icon set (no icon-library dependency)
  lib/
    data.ts                 — deterministic mock data (no backend)
    theme.tsx                — light/dark theme context (localStorage-persisted)
  test/setup.ts              — vitest + jest-dom + jest-axe setup
```

## 3. Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **ESLint 9** (`eslint-config-next`, includes `jsx-a11y`)
- **Vitest** + **@testing-library/react** + **jest-axe** for tests
- npm (a `package-lock.json` is committed)

No icon library, no UI kit, no state-management library, no CSS-in-JS — the
project is intentionally small, per its own design goals.

## 4. Installation

```bash
npm install
```

## 5. Running locally

```bash
npm run dev
```

Then open <http://localhost:3000>.

Other scripts:

```bash
npm run build       # production build
npm run start        # run the production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run test           # vitest run (unit/component + accessibility tests)
npm run test:watch      # vitest, watch mode
npm run test:a11y        # only the *.a11y.test.tsx accessibility bug-presence tests
```

## 6. Test pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard — stats, recent activity, profile, theme selector |
| `/accessibility` | Index of where each accessibility test case lives (does not duplicate the components) |
| `/forms` | Form accessibility test case (OL-004) |
| `/responsive` | Mobile overflow test case (OL-003) |
| `/console` | Console/network test case (OL-005) |
| `/performance` | Performance test case (OL-006) |

## 7. Intentional bugs

Full detail, exact code, and expected fixes are in **[TEST-CASES.md](./TEST-CASES.md)**.
Summary:

| ID | Issue | File |
|----|-------|------|
| OL-001 | Icon-only button has no accessible name | `src/components/dashboard/ThemeSelector.tsx` |
| OL-002 | Avatar image has no `alt` text | `src/components/dashboard/ProfileCard.tsx` |
| OL-003 | Table causes mobile horizontal page overflow | `src/components/responsive/AnalyticsTable.tsx` |
| OL-004 | Input's visible label isn't programmatically associated | `src/components/forms/ContactForm.tsx` |
| OL-005 | A user action logs a real (non-crashing) `console.error` | `src/components/console/ConsoleErrorDemo.tsx` |
| OL-006 | Unmemoized expensive computation on every keystroke | `src/components/performance/HeavySearchTable.tsx` |

Every bug is marked in source with `// ORIGAMI-LENS-TEST: <MARKER-ID>` (see
TEST-CASES.md for the full marker list). These comments are for locating
test cases only and are never rendered in the UI.

**A note on how these were chosen:** two of the six (OL-001, OL-004) were
adjusted after actually running `jest-axe` (the same `axe-core` engine
Origami Lens's browser worker uses) against an earlier draft and finding
that draft was *not* actually detectable. See TEST-CASES.md's "A note on
what 'detectable' actually means here" for the specific example — this
project only claims a bug is real once a real scanner has confirmed it.

## 8. Expected Origami Lens behavior

For each fixable issue, Origami Lens is expected to:

1. Detect it via a normal browser scan (DOM/axe-core/console/network/visual,
   as appropriate to the issue — see the table in TEST-CASES.md).
2. Resolve the connected repository and propose a fix grounded in the
   **actual flagged DOM element** — every bug here has a single,
   unambiguous source component (see TEST-CASES.md's "Source grounding"
   section), so a correct implementation should reach **HIGH** source-
   grounding confidence for OL-001 and OL-002 in particular.
3. Produce a small, localized patch (one or two lines) — never a rewrite.
4. Pass syntax validation.
5. Create a branch named `ai-fix/OL-0XX-...`, commit, and push it.
6. Open a Pull Request against `main` (never push directly to `main`).

## 9. GitHub PR workflow

```
main
 ↓
feature/fix branch (ai-fix/OL-0XX-...)
 ↓
Pull Request
 ↓
review
 ↓
merge
 ↓
main updated
```

This repository never pushes directly to `main` — the application itself
has no push access; only Origami Lens's own PR-creation workflow, followed
by a human (or reviewer) merge, updates `main`. See
`docs/VALIDATION.md`'s "GitHub branch safety" expectations.

## 10. Before/after verification

Full before/after procedure and pass/fail criteria for every issue:
**[docs/VALIDATION.md](./docs/VALIDATION.md)**.

Short version, per issue:

```
1. Confirm the bug on main.
2. Scan → detect → fix → PR → merge.
3. git pull origin main.
4. Fully stop and restart the dev server.
5. Open the page in a NEW browser tab.
6. Run a completely fresh Origami Lens scan (new scan ID).
7. Confirm the original issue is gone.
8. Run that issue's regression check (see docs/VALIDATION.md).
```

## 11. Reset instructions

To restore this repository to its intentional-bug baseline (e.g. after
experimenting with a fix locally without merging a PR):

```bash
git fetch origin
git checkout main
git reset --hard origin/main
npm install
npm run dev
```

To reproduce the full test cycle from a clean clone:

```bash
git clone <this-repo-url>
cd origami-lens-fix-validation-app
npm install
npm run dev
# open the test pages listed above, trigger each intentional issue
# (see TEST-CASES.md for exactly how)
# then run Origami Lens's scan against the running app,
# fix one issue, create a PR, merge it,
# git pull origin main, restart the app, and scan again
# to verify that issue is gone (see docs/VALIDATION.md)
```

## 12. Troubleshooting

- **`npm run lint` reports one warning on `ProfileCard.tsx`** —
  `@next/next/no-img-element`. This is expected and documented in
  TEST-CASES.md (OL-002); it's an unrelated Next.js performance suggestion,
  not the accessibility bug, and it does not fail the lint script.
- **Turbopack prints a warning about an ignored `package-lock.json` in a
  parent directory** — this can happen if this project lives under a
  directory tree that itself contains an unrelated lockfile higher up.
  `next.config.ts` already pins `turbopack.root` to this project's own
  directory to avoid it; if you see it anyway, confirm you're running
  commands from inside `origami-lens-fix-validation-app/`.
- **A test that asserts a bug IS present (`*.a11y.test.tsx`) starts
  failing** — that's the expected outcome once the corresponding fix has
  actually been applied and merged. Update that specific test to assert
  the opposite at that point (see the comment inside each `*.a11y.test.tsx`
  file) — do not "fix" it by reverting the real component fix.
- **Origami Lens can't resolve a repository for a scanned finding** —
  make sure this repository has been connected in Origami Lens's dashboard
  and is fully indexed before proposing a fix; a not-yet-indexed repository
  will report `REPOSITORY_NOT_READY`.
