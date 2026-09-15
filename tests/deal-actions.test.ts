import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDeal, deleteDeal, updateDeal, updateDealStage } from "@/lib/actions/deals";

// Mock next/cache so revalidatePath is a no-op in tests
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const {
  dealFindUnique,
  contactFindUnique,
  companyFindUnique,
  create,
  update,
  deleteDealDb,
} = vi.hoisted(() => ({
  dealFindUnique: vi.fn(),
  contactFindUnique: vi.fn(),
  companyFindUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  deleteDealDb: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    deal: {
      findUnique: dealFindUnique,
      create,
      update,
      delete: deleteDealDb,
    },
    contact: {
      findUnique: contactFindUnique,
    },
    company: {
      findUnique: companyFindUnique,
    },
  },
}));

describe("deal server actions", () => {
  beforeEach(() => {
    dealFindUnique.mockReset();
    contactFindUnique.mockReset();
    companyFindUnique.mockReset();
    create.mockReset();
    update.mockReset();
    deleteDealDb.mockReset();
  });

  describe("createDeal", () => {
    it("returns errors when required fields are missing", async () => {
      const formData = new FormData();
      formData.set("title", "");
      formData.set("value", "");

      const result = await createDeal({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.errors?.title).toBeDefined();
      expect(result.errors?.value).toBeDefined();
      expect(create).not.toHaveBeenCalled();
    });

    it("returns an error when value is negative", async () => {
      const formData = new FormData();
      formData.set("title", "Big Deal");
      formData.set("value", "-100");

      const result = await createDeal({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.errors?.value).toBeDefined();
      expect(create).not.toHaveBeenCalled();
    });

    it("creates a deal with default stage PROSPECT", async () => {
      create.mockResolvedValue({
        id: "deal-1",
        title: "New SaaS License",
        value: 5000,
        currency: "USD",
        stage: "PROSPECT",
      });

      const formData = new FormData();
      formData.set("title", "New SaaS License");
      formData.set("value", "5000");
      formData.set("currency", "USD");
      formData.set("stage", "PROSPECT");

      const result = await createDeal({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: "New SaaS License",
            value: 5000,
            currency: "USD",
            stage: "PROSPECT",
          }),
        }),
      );
    });

    it("rejects an invalid contactId", async () => {
      contactFindUnique.mockResolvedValue(null);

      const formData = new FormData();
      formData.set("title", "Orphan Deal");
      formData.set("value", "1000");
      formData.set("contactId", "nonexistent-contact");

      const result = await createDeal({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.errors?.contactId).toBeDefined();
      expect(create).not.toHaveBeenCalled();
    });

    it("rejects an invalid companyId", async () => {
      companyFindUnique.mockResolvedValue(null);

      const formData = new FormData();
      formData.set("title", "Orphan Deal");
      formData.set("value", "1000");
      formData.set("companyId", "nonexistent-company");

      const result = await createDeal({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.errors?.companyId).toBeDefined();
      expect(create).not.toHaveBeenCalled();
    });

    it("associates a valid contactId and companyId on creation", async () => {
      contactFindUnique.mockResolvedValue({ id: "contact-1" });
      companyFindUnique.mockResolvedValue({ id: "company-1" });
      create.mockResolvedValue({ id: "deal-2", title: "Enterprise Deal" });

      const formData = new FormData();
      formData.set("title", "Enterprise Deal");
      formData.set("value", "50000");
      formData.set("contactId", "contact-1");
      formData.set("companyId", "company-1");

      const result = await createDeal({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            contactId: "contact-1",
            companyId: "company-1",
          }),
        }),
      );
    });
  });

  describe("updateDeal", () => {
    it("updates a deal and clears optional associations when omitted", async () => {
      update.mockResolvedValue({ id: "deal-1", title: "Revised Deal" });

      const formData = new FormData();
      formData.set("title", "Revised Deal");
      formData.set("value", "8000");
      formData.set("stage", "PROPOSAL");

      const result = await updateDeal("deal-1", { success: true }, formData);

      expect(result.success).toBe(true);
      expect(update).toHaveBeenCalledWith({
        where: { id: "deal-1" },
        data: expect.objectContaining({
          title: "Revised Deal",
          value: 8000,
          stage: "PROPOSAL",
          contactId: null,
          companyId: null,
        }),
      });
    });
  });

  describe("updateDealStage", () => {
    it("updates the stage to a valid value", async () => {
      update.mockResolvedValue({ id: "deal-1", stage: "CLOSED_WON" });

      const result = await updateDealStage("deal-1", "CLOSED_WON");

      expect(result.success).toBe(true);
      expect(update).toHaveBeenCalledWith({
        where: { id: "deal-1" },
        data: { stage: "CLOSED_WON" },
      });
    });

    it("rejects an invalid stage value", async () => {
      // @ts-expect-error intentionally passing bad stage
      const result = await updateDealStage("deal-1", "INVALID_STAGE");

      expect(result.success).toBe(false);
      expect(update).not.toHaveBeenCalled();
    });
  });

  describe("deleteDeal", () => {
    it("deletes a deal by id", async () => {
      deleteDealDb.mockResolvedValue({ id: "deal-1" });

      const result = await deleteDeal("deal-1");

      expect(result.success).toBe(true);
      expect(deleteDealDb).toHaveBeenCalledWith({ where: { id: "deal-1" } });
    });

    it("returns failure when delete throws", async () => {
      deleteDealDb.mockRejectedValue(new Error("DB error"));

      const result = await deleteDeal("deal-1");

      expect(result.success).toBe(false);
    });
  });
});
