"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import type { ActionState } from "@/lib/actions/auth";

export type DealStage =
  | "PROSPECT"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

const validStages = new Set<DealStage>([
  "PROSPECT",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
]);

function normalizeStage(value: string | null): DealStage {
  const normalized = String(value ?? "PROSPECT").trim().toUpperCase() as DealStage;
  return validStages.has(normalized) ? normalized : "PROSPECT";
}

function parseDealFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const valueRaw = String(formData.get("value") ?? "").trim();
  const value = parseFloat(valueRaw);
  const currency = String(formData.get("currency") ?? "USD").trim() || "USD";
  const stage = normalizeStage(String(formData.get("stage") ?? "PROSPECT"));
  const expectedCloseDateRaw = String(formData.get("expectedCloseDate") ?? "").trim();
  const expectedCloseDate = expectedCloseDateRaw
    ? new Date(expectedCloseDateRaw)
    : null;
  const contactId = String(formData.get("contactId") ?? "").trim() || null;
  const companyId = String(formData.get("companyId") ?? "").trim() || null;

  return { title, value, currency, stage, expectedCloseDate, contactId, companyId };
}

export async function createDeal(
  _prevState: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<unknown>> {
  const { title, value, currency, stage, expectedCloseDate, contactId, companyId } =
    parseDealFormData(formData);
  const errors: Record<string, string[]> = {};

  if (!title) errors.title = ["Deal title is required."];
  if (isNaN(value) || value < 0) errors.value = ["Value must be a number ≥ 0."];

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Check the highlighted fields.", errors };
  }

  if (contactId) {
    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) {
      return {
        success: false,
        message: "The selected contact could not be found.",
        errors: { contactId: ["Please choose a valid contact."] },
      };
    }
  }

  if (companyId) {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return {
        success: false,
        message: "The selected company could not be found.",
        errors: { companyId: ["Please choose a valid company."] },
      };
    }
  }

  const deal = await prisma.deal.create({
    data: {
      title,
      value,
      currency,
      stage,
      ...(expectedCloseDate ? { expectedCloseDate } : {}),
      ...(contactId ? { contactId } : {}),
      ...(companyId ? { companyId } : {}),
    },
  });

  revalidatePath("/deals");

  return { success: true, message: "Deal created.", data: deal };
}

export async function updateDeal(
  id: string,
  _prevState: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<unknown>> {
  const { title, value, currency, stage, expectedCloseDate, contactId, companyId } =
    parseDealFormData(formData);
  const errors: Record<string, string[]> = {};

  if (!title) errors.title = ["Deal title is required."];
  if (isNaN(value) || value < 0) errors.value = ["Value must be a number ≥ 0."];

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Check the highlighted fields.", errors };
  }

  if (contactId) {
    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) {
      return {
        success: false,
        message: "The selected contact could not be found.",
        errors: { contactId: ["Please choose a valid contact."] },
      };
    }
  }

  if (companyId) {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return {
        success: false,
        message: "The selected company could not be found.",
        errors: { companyId: ["Please choose a valid company."] },
      };
    }
  }

  const deal = await prisma.deal.update({
    where: { id },
    data: {
      title,
      value,
      currency,
      stage,
      expectedCloseDate: expectedCloseDate ?? null,
      contactId: contactId ?? null,
      companyId: companyId ?? null,
    },
  });

  revalidatePath("/deals");

  return { success: true, message: "Deal updated.", data: deal };
}

export async function updateDealStage(
  id: string,
  stage: DealStage,
): Promise<ActionState<unknown>> {
  if (!validStages.has(stage)) {
    return { success: false, message: "Invalid stage value." };
  }

  try {
    const deal = await prisma.deal.update({
      where: { id },
      data: { stage },
    });

    revalidatePath("/deals");

    return { success: true, message: "Stage updated.", data: deal };
  } catch {
    return { success: false, message: "The deal could not be updated." };
  }
}

export async function deleteDeal(id: string): Promise<ActionState<void>> {
  try {
    await prisma.deal.delete({ where: { id } });
    revalidatePath("/deals");
    return { success: true, message: "Deal deleted." };
  } catch {
    return { success: false, message: "The deal could not be deleted." };
  }
}
