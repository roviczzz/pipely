import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account | CRM Dashboard",
  description: "Create an account for CRM Dashboard.",
  openGraph: { title: "Create account | CRM Dashboard", description: "Create an account for CRM Dashboard." },
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <section className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Pipely CRM</p>
          <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">Start organizing your customer relationships.</p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}