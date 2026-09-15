import { beforeEach, describe, expect, it, vi } from "vitest";
import { register } from "@/lib/actions/auth";

const { findUnique, create } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
}));

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}));
vi.mock("@/lib/prisma", () => ({
  default: { user: { findUnique, create } },
}));
vi.mock("@/auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("bcryptjs", () => ({ hash: vi.fn().mockResolvedValue("hashed-password") }));

describe("register", () => {
  beforeEach(() => {
    findUnique.mockReset();
    create.mockReset();
  });

  it("returns field errors for invalid registration data", async () => {
    const result = await register(
      { success: true },
      new FormData(),
    );

    expect(result.success).toBe(false);
    expect(result.errors).toEqual({
      displayName: ["Enter your name."],
      email: ["Enter a valid email address."],
      password: ["Password must be at least 8 characters."],
    });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("rejects an email that already has an account", async () => {
    findUnique.mockResolvedValue({ id: "existing-user" });
    const formData = new FormData();
    formData.set("displayName", "Ada Lovelace");
    formData.set("email", "ada@example.com");
    formData.set("password", "password123");

    const result = await register({ success: true }, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.email).toEqual(["An account with this email already exists."]);
    expect(create).not.toHaveBeenCalled();
  });
});