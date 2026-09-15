"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState<void> = { success: true };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(authenticate, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>
      {state.message && <p className="text-sm text-destructive" aria-live="polite">{state.message}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {pending ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        New here? <Link href="/register" className="font-medium text-foreground underline underline-offset-4">Create an account</Link>
      </p>
    </form>
  );
}