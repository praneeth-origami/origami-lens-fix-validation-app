import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/lib/theme";
import { ThemeSelector } from "@/components/dashboard/ThemeSelector";

/**
 * Plain functional/unit test — unrelated to OL-001's accessibility bug.
 * Confirms the actual toggle behavior keeps working, which is exactly
 * what the OL-001 regression check in docs/VALIDATION.md relies on: the
 * expected fix only adds an aria-label, it must not touch this behavior.
 */
describe("ThemeSelector", () => {
  it("switches the document theme when the dark option is activated", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Dark theme" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
