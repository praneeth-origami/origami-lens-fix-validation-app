import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { ThemeProvider } from "@/lib/theme";
import { ThemeSelector } from "@/components/dashboard/ThemeSelector";

/**
 * TEST CASE OL-001 (bug-presence test) — see TEST-CASES.md.
 *
 * This intentionally asserts the violation IS present in the repository's
 * current state. Do NOT change this test to `toHaveNoViolations()` to make
 * it pass — that would hide the very bug this project exists to expose.
 * Once Origami Lens's fix (adding aria-label to the light-theme button) is
 * merged, THIS test should be updated to assert the opposite — that is the
 * expected, intentional lifecycle of this file (see docs/VALIDATION.md).
 */
describe("ThemeSelector — OL-001 accessibility bug (a11y)", () => {
  it("currently has a button-name violation (icon-only button with no accessible name)", async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>,
    );

    const results = await axe(container);
    const buttonNameViolation = results.violations.find((v) => v.id === "button-name");

    expect(buttonNameViolation).toBeDefined();
  });
});
