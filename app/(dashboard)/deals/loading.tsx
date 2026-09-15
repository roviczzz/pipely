export default function DealsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
      <div className="h-48 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-28 animate-pulse rounded-lg bg-muted" />
            <div className="h-28 animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
