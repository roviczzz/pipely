"use server";

import prisma from "@/lib/prisma";
import type { ActionState } from "@/lib/actions/auth";

const validStatuses = new Set(["LEAD", "ACTIVE", "INACTIVE"]);

function normalizeStatus(value: string | null): string {
  const status = String(value ?? "LEAD").trim().toUpperCase();
  return validStatuses.has(status) ? status : "LEAD";
}

function parseContactFormData(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const status = normalizeStatus(String(formData.get("status") ?? "LEAD"));
  const companyId = String(formData.get("companyId") ?? "").trim() || null;

  return {
    firstName,
    lastName,
    email,
    phone: phone || null,
    status,
    companyId,
  };
}

export async function createContact(
  _prevState: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<unknown>> {
  const { firstName, lastName, email, phone, status, companyId } = parseContactFormData(formData);
  const errors: Record<string, string[]> = {};

  if (!firstName) errors.firstName = ["First name is required."];
  if (!lastName) errors.lastName = ["Last name is required."];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Enter a valid email address."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Check the highlighted fields.",
      errors,
    };
  }

  const existingContact = await prisma.contact.findUnique({ where: { email } });
  if (existingContact) {
    return {
      success: false,
      message: "A contact with that email already exists.",
      errors: { email: ["A contact with that email already exists."] },
    };
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

  const contact = await prisma.contact.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      status,
      ...(companyId ? { companyId } : {}),
    },
  });

  return {
    success: true,
    message: "Contact created.",
    data: contact,
  };
}

export async function updateContact(
  id: string,
  _prevState: ActionState<unknown>,
  formData: FormData,
): Promise<ActionState<unknown>> {
  const { firstName, lastName, email, phone, status, companyId } = parseContactFormData(formData);
  const errors: Record<string, string[]> = {};

  if (!firstName) errors.firstName = ["First name is required."];
  if (!lastName) errors.lastName = ["Last name is required."];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Enter a valid email address."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Check the highlighted fields.",
      errors,
    };
  }

  const existingContact = await prisma.contact.findUnique({ where: { email } });
  if (existingContact && existingContact.id !== id) {
    return {
      success: false,
      message: "A contact with that email already exists.",
      errors: { email: ["A contact with that email already exists."] },
    };
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

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      phone,
      status,
      ...(companyId ? { companyId } : { companyId: null }),
    },
  });

  return {
    success: true,
    message: "Contact updated.",
    data: contact,
  };
}

export async function deleteContact(id: string): Promise<ActionState<void>> {
  try {
    await prisma.contact.delete({ where: { id } });
    return { success: true, message: "Contact deleted." };
  } catch {
    return { success: false, message: "The contact could not be deleted." };
  }
}
