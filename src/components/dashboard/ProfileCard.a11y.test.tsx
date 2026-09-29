import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { ProfileCard } from "@/components/dashboard/ProfileCard";

/**
 * TEST CASE OL-002 (bug-presence test) — see TEST-CASES.md.
 * Asserts the violation IS present today — see the note in
 * ThemeSelector.a11y.test.tsx about why this is intentional.
 */
describe("ProfileCard — OL-002 accessibility bug (a11y)", () => {
  it("currently has an image-alt violation (avatar image with no alt text)", async () => {
    const { container } = render(<ProfileCard />);

    const results = await axe(container);
    const imageAltViolation = results.violations.find((v) => v.id === "image-alt");

    expect(imageAltViolation).toBeDefined();
  });
});
