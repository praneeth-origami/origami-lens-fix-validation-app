import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";

describe("ContactForm", () => {
  it("shows a confirmation message after a successful submit", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);

    await user.type(screen.getByLabelText("Full name"), "Jordan Rivera");
    // Deliberately NOT screen.getByLabelText/getByRole with a name here —
    // the work-email field has no accessible name (that is OL-004's bug),
    // so it cannot be queried the accessible way. Falling back to a raw
    // attribute selector for this one field is itself evidence of the bug.
    const workEmailInput = container.querySelector('input[name="workEmail"]');
    if (!workEmailInput) throw new Error("expected the work-email input to exist");
    await user.type(workEmailInput, "jordan@example.com");
    await user.click(screen.getByRole("button", { name: "Submit request" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Thanks — your request has been submitted.");
  });
});
