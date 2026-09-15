"use client";

import { useTransition } from "react";

import { updateDealStage, type DealStage } from "@/lib/actions/deals";

const STAGES: { value: DealStage; label: string }[] = [
  { value: "PROSPECT", label: "Prospect" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "CLOSED_WON", label: "Closed Won" },
  { value: "CLOSED_LOST", label: "Closed Lost" },
];

const STAGE_COLORS: Record<DealStage, string> = {
  PROSPECT: "bg-blue-50 text-blue-700 border-blue-200",
  PROPOSAL: "bg-amber-50 text-amber-700 border-amber-200",
  NEGOTIATION: "bg-purple-50 text-purple-700 border-purple-200",
  CLOSED_WON: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED_LOST: "bg-rose-50 text-rose-700 border-rose-200",
};

export type DealCardData = {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: string;
  expectedCloseDate?: Date | null;
  contactName?: string | null;
  companyName?: string | null;
};

type DealCardProps = {
  deal: DealCardData;
  onDelete: (id: string) => void;
};

function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(0)}`;
  }
}

export function DealCard({ deal, onDelete }: DealCardProps) {
  const [isPending, startTransition] = useTransition();
  const stageColor =
    STAGE_COLORS[deal.stage as DealStage] ?? "bg-muted text-muted-foreground border";

  function handleStageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextStage = e.target.value as DealStage;
    startTransition(async () => {
      await updateDealStage(deal.id, nextStage);
    });
  }

  return (
    <article
      className={`group rounded-lg border bg-card p-4 shadow-sm transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <a
          href={`/deals?edit=${deal.id}`}
          className="flex-1 text-sm font-semibold leading-snug hover:underline"
        >
          {deal.title}
        </a>
        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          {formatCurrency(deal.value, deal.currency)}
        </span>
      </div>

      {(deal.contactName ?? deal.companyName) ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {[deal.contactName, deal.companyName].filter(Boolean).join(" · ")}
        </p>
      ) : null}

      {deal.expectedCloseDate ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Close:{" "}
          {new Date(deal.expectedCloseDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      ) : null}

      <div className="mt-3 flex items-center gap-2">
        {/* Stage selector — T038 */}
        <select
          value={deal.stage}
          onChange={handleStageChange}
          disabled={isPending}
          aria-label="Change deal stage"
          className={`flex-1 rounded border px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${stageColor}`}
        >
          {STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onDelete(deal.id)}
          className="rounded border border-destructive/20 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
