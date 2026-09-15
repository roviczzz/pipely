"use server";

import prisma from "@/lib/prisma";
import type { ActionState } from "@/lib/actions/auth";

const validSizes = new Set([
  "SIZE_1_10",
  "SIZE_11_50",
  "SIZE_51_200",
  "SIZE_200_PLUS",
]);

function normalizeSize(value: string | null): string | null {
  const normalized = String(value ?? "").trim().toUpperCase();
  return normalized && validSizes.has(normalized) ? normalized : null;
}

function parseCompanyFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const size = normalizeSize(String(formData.get("size") ?? ""));

  return { name, industry: industry || null, website: website || null, size };
}

export async function createCompany(
  _prevState: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<unknown>> {
  const { name, industry, website, size } = parseCompanyFormData(formData);
  const errors: Record<string, string[]> = {};

  if (!name) {
    errors.name = ["Company name is required."];
  }

  if (website && !/^https?:\/\//i.test(website)) {
    errors.website = ["Enter a valid website URL."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Check the highlighted fields.",
      errors,
    };
  }

  const existingCompany = await prisma.company.findFirst({ where: { name } });
  if (existingCompany) {
    return {
      success: false,
      message: "A company with that name already exists.",
      errors: { name: ["A company with that name already exists."] },
    };
  }

  const company = await prisma.company.create({
    data: {
      name,
      industry,
      website,
      size,
    },
  });

  return {
    success: true,
    message: "Company created.",
    data: company,
  };
}

export async function updateCompany(
  id: string,
  _prevState: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<unknown>> {
  const { name, industry, website, size } = parseCompanyFormData(formData);
  const errors: Record<string, string[]> = {};

  if (!name) {
    errors.name = ["Company name is required."];
  }

  if (website && !/^https?:\/\//i.test(website)) {
    errors.website = ["Enter a valid website URL."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Check the highlighted fields.",
      errors,
    };
  }

  const existingCompany = await prisma.company.findFirst({ where: { name } });
  if (existingCompany && existingCompany.id !== id) {
    return {
      success: false,
      message: "A company with that name already exists.",
      errors: { name: ["A company with that name already exists."] },
    };
  }

  const company = await prisma.company.update({
    where: { id },
    data: {
      name,
      industry,
      website,
      size,
    },
  });

  return {
    success: true,
    message: "Company updated.",
    data: company,
  };
}

export async function deleteCompany(id: string): Promise<ActionState<void>> {
  try {
    await prisma.company.delete({ where: { id } });
    return { success: true, message: "Company deleted." };
  } catch {
    return { success: false, message: "The company could not be deleted." };
  }
}
