import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | CRM Dashboard",
  description: "Sign in to your CRM Dashboard account.",
  openGraph: { title: "Sign in | CRM Dashboard", description: "Sign in to your CRM Dashboard account." },
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <section className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Pipely CRM</p>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue to your workspace.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}