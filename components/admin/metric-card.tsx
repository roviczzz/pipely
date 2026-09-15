import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string | number;
  helper: string;
  icon: ReactNode;
  accentClassName?: string;
};

export function MetricCard({
  label,
  value,
  helper,
  icon,
  accentClassName,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg text-primary",
            accentClassName ?? "bg-muted",
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{helper}</p>
    </div>
  );
}
