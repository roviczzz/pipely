import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompanyForm } from "@/components/crm/company-form";

vi.mock("@/lib/actions/companies", () => ({
  createCompany: vi.fn(),
  updateCompany: vi.fn(),
}));

describe("company form", () => {
  it("renders the company fields and submit action", () => {
    render(<CompanyForm company={null} />);

    expect(screen.getByLabelText("Company name")).toBeInTheDocument();
    expect(screen.getByLabelText("Industry")).toBeInTheDocument();
    expect(screen.getByLabelText("Website")).toBeInTheDocument();
    expect(screen.getByLabelText("Company size")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create company" })).toBeInTheDocument();
  });
});
