# VALIDATION.md

This document is the step-by-step before/after validation procedure for
proving that Origami Lens genuinely fixes real issues in this repository —
not that it merely *appears* to, by hiding, caching, or filtering a result.

See the parent README for setup and `TEST-CASES.md` for what each issue
actually is. This document does not repeat that detail — it defines the
**procedure** and the **pass/fail criteria**.

## Non-negotiable rules for this validation

The test is invalid if any of the following happened instead of a genuine
fix:

- The scanner or extension was not actually re-run after the merge.
- The dev server was not actually restarted.
- The browser tab was reused without a hard refresh / new tab.
- The "after" result came from the same scan ID as the "before" result.
- The issue was hidden by frontend filtering rather than actually absent
  from a fresh scan.
- The issue was manually marked "resolved" in the dashboard rather than
  disappearing because a fresh scan didn't find it.
- Any part of the result was hardcoded, mocked, or asserted without
  actually running the tool.

## General procedure (repeat per issue)

```
1. Confirm the bug exists in main (this repo's default state).
2. Start the application (npm run dev) — note the exact URL/port.
3. Open the relevant page in a NEW browser tab.
4. Run an Origami Lens scan against that URL.
5. Confirm Origami Lens reports the issue (BEFORE — expected: FAIL).
6. Ask Origami Lens to fix the issue.
7. Review the generated fix proposal / source-grounding confidence.
8. Approve → branch created (ai-fix/OL-0XX-...) → commit → push → PR opened.
9. Review and merge the PR on GitHub.
10. Locally: git pull origin main.
11. Stop the running dev server completely (not just refresh).
12. Restart it: npm run dev.
13. Open the same page in a genuinely NEW browser tab (not a refresh of the old one).
14. Run a brand-new Origami Lens scan (a new scan ID, not a re-read of the old one).
15. Confirm the original issue is no longer reported (AFTER — expected: PASS).
16. Run the regression check for that issue (see below).
```

## OL-001 — Theme selector accessible name

**BEFORE**

```
Issue detected: OL-001
Page: /
Selector: button.theme-option (the "light" option, first of the pair)
Component: src/components/dashboard/ThemeSelector.tsx
Finding: Button has no accessible name.
Expected: FAIL (issue present)
```

**AFTER (post PR merge, fresh scan)**

```
Same page: /
Same selector: button.theme-option
Same component: src/components/dashboard/ThemeSelector.tsx
Finding: (none — button now has aria-label="Light theme")
Expected: PASS (issue absent)
```

**Regression check:** click both theme buttons; confirm the active theme
still visibly changes (background/text of the main content area) and
persists across a reload (`localStorage` key `origami-lens-test-theme`).
`npm run test` → `ThemeSelector.test.tsx` covers this mechanically.

## OL-002 — Profile avatar alt text

**BEFORE**

```
Issue detected: OL-002
Page: /
Selector: img (inside the "Your profile" card, .rounded-full)
Component: src/components/dashboard/ProfileCard.tsx
Finding: Image has no alt attribute.
Expected: FAIL
```

**AFTER**

```
Same page: /
Same selector: img.rounded-full
Same component: src/components/dashboard/ProfileCard.tsx
Finding: (none — alt is now present and non-empty)
Expected: PASS
```

**Regression check:** the profile card still renders the avatar, name,
role, and "Edit profile" button exactly as before — the fix only adds an
attribute, it must not change layout or behavior.

## OL-003 — Analytics table mobile overflow

**BEFORE**

```
Issue detected: OL-003
Page: /responsive
Viewport: mobile (≤ 480px wide)
Component: src/components/responsive/AnalyticsTable.tsx
Finding: Page scrolls horizontally; table min-width (1100px) exceeds viewport.
Expected: FAIL
```

**AFTER**

```
Same page: /responsive
Same viewport
Same component
Finding: (none — table is wrapped in an overflow-x-auto container; the
          PAGE no longer scrolls horizontally, only the table's own
          bounded area does, exactly like RecentActivityTable)
Expected: PASS
```

**Regression check:** on desktop width, the table still shows all 8
columns and all 5 rows unchanged.

## OL-004 — Work email field label association

**BEFORE**

```
Issue detected: OL-004
Page: /forms
Selector: input[name="workEmail"]
Component: src/components/forms/ContactForm.tsx
Finding: Form control has no accessible name (visible <span> text is not
          programmatically associated).
Expected: FAIL
```

**AFTER**

```
Same page: /forms
Same selector: input[name="workEmail"] (now input#work-email)
Same component: src/components/forms/ContactForm.tsx
Finding: (none — the <span> is now a <label htmlFor="work-email">, or an
          equivalent aria-labelledby/aria-label was added)
Expected: PASS
```

**Regression check:** submitting the form with a name and a work email
still shows "Thanks — your request has been submitted." —
`npm run test` → `ContactForm.test.tsx` covers the submit flow mechanically.

## OL-005 — Console error on corrupted cache

**BEFORE**

```
Issue detected: OL-005
Page: /console
Trigger: click "Load extended profile"
Finding: console.error logged — "[origami-lens-test] Failed to parse
          cached extended-profile payload: SyntaxError: ..."
Expected: FAIL (console error occurs)
```

**AFTER**

```
Same page: /console
Same trigger
Finding: (none — the cache-read path now validates/guards against
          malformed JSON before parsing, or the write path no longer
          allows a malformed value to be stored)
Expected: PASS (no console error on this interaction)
```

**Regression check:** the button still transitions to a visible status
message either way (success or a handled, non-crashing failure state); the
rest of the page is unaffected.

## OL-006 — Customer directory search performance

**BEFORE**

```
Issue detected: OL-006
Page: /performance
Trigger: type in "Search customer directory"
Finding: measurable input lag / long main-thread task per keystroke over
          6,000 records, recomputed unmemoized on every render.
Expected: FAIL
```

**AFTER**

```
Same page: /performance
Same trigger
Finding: (none — filtering/ranking is now memoized on `query` and/or
          debounced; typing no longer blocks the main thread noticeably)
Expected: PASS
```

**Regression check:** searching still returns the correct top-50 ranked
matches for a given query; clearing the search still shows the default
(unfiltered, ranked-as-empty-query) list.

## Fix-success criteria (applies to every issue above)

A fix is **only** considered successful when **all** of the following are
true — never on any subset of these:

1. A PR was created.
2. The PR was merged.
3. The latest `main` was pulled locally.
4. The application starts successfully after the pull (no build/runtime
   errors introduced).
5. A fresh Origami Lens scan ran (new scan ID, new browser tab, restarted
   dev server).
6. The original issue is no longer detected by that fresh scan.
7. The relevant functionality still works (see each issue's regression
   check above).
8. No new critical regression was introduced (spot-check the other five
   pages still render and their own known issues are unchanged — i.e. fixing
   OL-001 must not accidentally also silently touch OL-002/003/004/005/006).

Generating a proposal, applying a patch, committing, or even merging a PR
does **not**, by itself, satisfy this list — only steps 5 and 6, run for
real, do.

## Multiple/sequential fixes

Each `OL-0XX` issue lives in its own component and is independently
fixable — PR #1 for OL-001, PR #2 for OL-002, etc., in any order, without
one depending on another. None of the six intentional bugs reference or
depend on any other one being fixed first.
