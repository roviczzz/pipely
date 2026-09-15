export default function CompaniesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="h-[420px] animate-pulse rounded-xl bg-muted" />
        <div className="h-[420px] animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
