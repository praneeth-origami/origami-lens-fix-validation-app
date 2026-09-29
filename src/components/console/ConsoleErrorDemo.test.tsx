import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsoleErrorDemo } from "@/components/console/ConsoleErrorDemo";

/**
 * TEST CASE OL-005 — see TEST-CASES.md.
 *
 * Documents/verifies the exact, deterministic console.error this test case
 * produces, and confirms the app does NOT crash when it happens (the
 * component keeps rendering and shows a normal, non-crashed status message).
 */
describe("ConsoleErrorDemo — OL-005 console error", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs a real console.error when loading the extended profile, without crashing", async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<ConsoleErrorDemo />);

    await user.click(screen.getByRole("button", { name: "Load extended profile" }));

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("[origami-lens-test] Failed to parse cached extended-profile payload:"),
      expect.anything(),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("Could not load extended profile");
  });
});
