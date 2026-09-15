"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Unexpected error
        </p>
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or return to the dashboard.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="rounded-md border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Go to dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
