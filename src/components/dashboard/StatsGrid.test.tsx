import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { STATS } from "@/lib/data";

describe("StatsGrid", () => {
  it("renders one card per stat with its label and value", () => {
    render(<StatsGrid />);

    for (const stat of STATS) {
      expect(screen.getByText(stat.label)).toBeInTheDocument();
      expect(screen.getByText(stat.value)).toBeInTheDocument();
    }
  });
});
