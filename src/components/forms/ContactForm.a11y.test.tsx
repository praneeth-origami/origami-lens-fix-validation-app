import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { ContactForm } from "@/components/forms/ContactForm";

/**
 * TEST CASE OL-004 (bug-presence test) — see TEST-CASES.md.
 * Asserts the violation IS present today — see the note in
 * ThemeSelector.a11y.test.tsx about why this is intentional.
 */
describe("ContactForm — OL-004 accessibility bug (a11y)", () => {
  it("currently has a label violation (work email input with no associated label)", async () => {
    const { container } = render(<ContactForm />);

    const results = await axe(container);
    const labelViolation = results.violations.find((v) => v.id === "label");

    expect(labelViolation).toBeDefined();
  });
});
