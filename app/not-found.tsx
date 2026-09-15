import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | CRM Dashboard",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-md border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
