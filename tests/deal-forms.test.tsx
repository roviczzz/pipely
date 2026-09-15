import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DealForm } from "@/components/crm/deal-form";

vi.mock("@/lib/actions/deals", () => ({
  createDeal: vi.fn(),
  updateDeal: vi.fn(),
}));

describe("deal form", () => {
  it("renders all required fields and submit button for new deal", () => {
    render(<DealForm deal={null} contacts={[]} companies={[]} />);

    expect(screen.getByLabelText("Deal title")).toBeInTheDocument();
    expect(screen.getByLabelText("Value")).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Stage")).toBeInTheDocument();
    expect(screen.getByLabelText("Expected close date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create deal" })).toBeInTheDocument();
  });

  it("renders Save changes button and Cancel link when editing", () => {
    render(
      <DealForm
        deal={{ id: "deal-1", title: "Existing Deal", value: 1000, stage: "PROPOSAL" }}
        contacts={[]}
        companies={[]
        }
      />,
    );

    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
  });

  it("does not render Contact and Company selects when lists are empty", () => {
    render(<DealForm deal={null} contacts={[]} companies={[]} />);

    expect(screen.queryByLabelText("Contact")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Company")).not.toBeInTheDocument();
  });

  it("renders Contact and Company selects when lists are provided", () => {
    render(
      <DealForm
        deal={null}
        contacts={[{ id: "c-1", firstName: "Ada", lastName: "Lovelace" }]}
        companies={[{ id: "co-1", name: "Pipely" }]}
      />,
    );

    expect(screen.getByLabelText("Contact")).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Pipely")).toBeInTheDocument();
  });
});
