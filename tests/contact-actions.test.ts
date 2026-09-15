import { beforeEach, describe, expect, it, vi } from "vitest";
import { createContact, deleteContact, updateContact } from "@/lib/actions/contacts";

const { contactFindUnique, companyFindUnique, create, update, delete: deleteContactDb } = vi.hoisted(() => ({
  contactFindUnique: vi.fn(),
  companyFindUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    contact: {
      findUnique: contactFindUnique,
      create,
      update,
      delete: deleteContactDb,
    },
    company: {
      findUnique: companyFindUnique,
    },
  },
}));

describe("contact server actions", () => {
  beforeEach(() => {
    contactFindUnique.mockReset();
    companyFindUnique.mockReset();
    create.mockReset();
    update.mockReset();
    deleteContactDb.mockReset();
  });

  it("validates required contact fields before creating a record", async () => {
    const formData = new FormData();
    formData.set("firstName", "");
    formData.set("lastName", "");
    formData.set("email", "");

    const result = await createContact({ success: true }, formData);

    expect(result.success).toBe(false);
    expect(result.errors).toEqual({
      firstName: ["First name is required."],
      lastName: ["Last name is required."],
      email: ["Enter a valid email address."],
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("creates a contact with an optional company association", async () => {
    contactFindUnique.mockResolvedValue(null);
    companyFindUnique.mockResolvedValue({ id: "company-42", name: "Pipely" });
    create.mockResolvedValue({ id: "contact-1", firstName: "Ada", lastName: "Lovelace" });

    const formData = new FormData();
    formData.set("firstName", "Ada");
    formData.set("lastName", "Lovelace");
    formData.set("email", "ada@example.com");
    formData.set("status", "LEAD");
    formData.set("companyId", "company-42");

    const result = await createContact({ success: true }, formData);

    expect(result.success).toBe(true);
    expect(create).toHaveBeenCalledWith({
      data: {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: null,
        status: "LEAD",
        companyId: "company-42",
      },
    });
  });

  it("updates an existing contact and keeps the new values", async () => {
    contactFindUnique.mockResolvedValue(null);
    companyFindUnique.mockResolvedValue({ id: "company-99", name: "Acme" });
    update.mockResolvedValue({ id: "contact-1", firstName: "Grace", lastName: "Hopper" });

    const formData = new FormData();
    formData.set("firstName", "Grace");
    formData.set("lastName", "Hopper");
    formData.set("email", "grace@example.com");
    formData.set("phone", "+1 555 000 0000");
    formData.set("status", "ACTIVE");

    const result = await updateContact("contact-1", { success: true }, formData);

    expect(result.success).toBe(true);
    expect(update).toHaveBeenCalledWith({
      where: { id: "contact-1" },
      data: {
        firstName: "Grace",
        lastName: "Hopper",
        email: "grace@example.com",
        phone: "+1 555 000 0000",
        status: "ACTIVE",
        companyId: null,
      },
    });
  });

  it("deletes a contact by id", async () => {
    deleteContactDb.mockResolvedValue({ id: "contact-1" });

    const result = await deleteContact("contact-1");

    expect(result.success).toBe(true);
    expect(deleteContactDb).toHaveBeenCalledWith({ where: { id: "contact-1" } });
  });
});
