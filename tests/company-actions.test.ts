import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCompany, deleteCompany, updateCompany } from "@/lib/actions/companies";

const { companyFindUnique, companyFindFirst, create, update, delete: deleteCompanyDb } = vi.hoisted(() => ({
  companyFindUnique: vi.fn(),
  companyFindFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    company: {
      findUnique: companyFindUnique,
      findFirst: companyFindFirst,
      create,
      update,
      delete: deleteCompanyDb,
    },
  },
}));

describe("company server actions", () => {
  beforeEach(() => {
    companyFindUnique.mockReset();
    companyFindFirst.mockReset();
    create.mockReset();
    update.mockReset();
    deleteCompanyDb.mockReset();
  });

  it("validates required fields before creating a company", async () => {
    const formData = new FormData();
    formData.set("name", "");
    formData.set("industry", "");

    const result = await createCompany({ success: true }, formData);

    expect(result.success).toBe(false);
    expect(result.errors).toEqual({
      name: ["Company name is required."],
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("creates a company with a normalized size and website", async () => {
    companyFindFirst.mockResolvedValue(null);
    create.mockResolvedValue({ id: "company-1", name: "Pipely", website: "https://pipely.example" });

    const formData = new FormData();
    formData.set("name", "Pipely");
    formData.set("industry", "Software");
    formData.set("website", "https://pipely.example");
    formData.set("size", "SIZE_11_50");

    const result = await createCompany({ success: true }, formData);

    expect(result.success).toBe(true);
    expect(create).toHaveBeenCalledWith({
      data: {
        name: "Pipely",
        industry: "Software",
        website: "https://pipely.example",
        size: "SIZE_11_50",
      },
    });
  });

  it("updates an existing company with sanitized values", async () => {
    companyFindFirst.mockResolvedValue(null);
    update.mockResolvedValue({ id: "company-1", name: "Acme" });

    const formData = new FormData();
    formData.set("name", "Acme");
    formData.set("industry", "Finance");
    formData.set("website", "https://acme.example");
    formData.set("size", "SIZE_51_200");

    const result = await updateCompany("company-1", { success: true }, formData);

    expect(result.success).toBe(true);
    expect(update).toHaveBeenCalledWith({
      where: { id: "company-1" },
      data: {
        name: "Acme",
        industry: "Finance",
        website: "https://acme.example",
        size: "SIZE_51_200",
      },
    });
  });

  it("deletes a company by id", async () => {
    deleteCompanyDb.mockResolvedValue({ id: "company-1" });

    const result = await deleteCompany("company-1");

    expect(result.success).toBe(true);
    expect(deleteCompanyDb).toHaveBeenCalledWith({ where: { id: "company-1" } });
  });
});
