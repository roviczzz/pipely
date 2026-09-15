'use client';

export default function CompaniesError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="max-w-md rounded-xl border bg-card p-6 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Companies issue
        </p>
        <h2 className="mt-3 text-2xl font-semibold">Something went wrong</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We could not load your companies. Refresh this page to try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
