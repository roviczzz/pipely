"use client";

import { useTransition } from "react";

import { deleteDeal } from "@/lib/actions/deals";
import { DealCard, type DealCardData } from "@/components/crm/deal-card";

type DealStage = DealCardData["stage"];

const STAGE_COLUMNS: { id: DealStage; label: string }[] = [
  { id: "PROSPECT", label: "Prospect" },
  { id: "PROPOSAL", label: "Proposal" },
  { id: "NEGOTIATION", label: "Negotiation" },
  { id: "CLOSED_WON", label: "Closed Won" },
  { id: "CLOSED_LOST", label: "Closed Lost" },
];

type KanbanBoardProps = {
  deals: DealCardData[];
};

export function KanbanBoard({ deals }: KanbanBoardProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteDeal(id);
    });
  }

  if (deals.length === 0) {
    return (
      <section className="rounded-xl border bg-card p-8 shadow-sm text-center">
        <p className="text-sm text-muted-foreground">
          No deals yet. Add the first deal to start tracking your pipeline.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`transition-opacity ${isPending ? "opacity-60" : ""}`}
      aria-label="Deals Kanban board"
    >
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {STAGE_COLUMNS.map((column) => {
          const columnDeals = deals.filter((d) => d.stage === column.id);
          return (
            <div key={column.id} className="flex flex-col gap-2">
              {/* Column header */}
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {column.label}
                </h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {columnDeals.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {columnDeals.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                    Empty
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} onDelete={handleDelete} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
