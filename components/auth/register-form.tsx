"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState<void> = { success: true };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);
  const fieldError = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">Name</label>
        <input id="displayName" name="displayName" type="text" autoComplete="name" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        {fieldError("displayName") && <p className="text-sm text-destructive">{fieldError("displayName")}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        {fieldError("email") && <p className="text-sm text-destructive">{fieldError("email")}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        {fieldError("password") && <p className="text-sm text-destructive">{fieldError("password")}</p>}
      </div>
      {state.message && !state.errors && <p className="text-sm text-destructive" aria-live="polite">{state.message}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {pending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Already registered? <Link href="/login" className="font-medium text-foreground underline underline-offset-4">Sign in</Link>
      </p>
    </form>
  );
}