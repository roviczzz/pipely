"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";

export type ActionState<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

const initialSuccess: ActionState<void> = { success: true };

function getCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function authenticate(
  _prevState: ActionState<void>,
  formData: FormData,
): Promise<ActionState<void>> {
  const { email, password } = getCredentials(formData);

  if (!email || !password) {
    return {
      success: false,
      message: "Enter your email and password.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Your email or password is incorrect.",
      };
    }

    throw error;
  }

  return initialSuccess;
}

export async function register(
  _prevState: ActionState<void>,
  formData: FormData,
): Promise<ActionState<void>> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const { email, password } = getCredentials(formData);
  const errors: Record<string, string[]> = {};

  if (!displayName) errors.displayName = ["Enter your name."];
  if (!email || !email.includes("@")) {
    errors.email = ["Enter a valid email address."];
  }
  if (password.length < 8) {
    errors.password = ["Password must be at least 8 characters."];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors, message: "Check the highlighted fields." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return {
      success: false,
      errors: { email: ["An account with this email already exists."] },
      message: "That email is already registered.",
    };
  }

  await prisma.user.create({
    data: {
      displayName,
      email,
      passwordHash: await hash(password, 12),
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });

  return initialSuccess;
}

export async function logOut(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}