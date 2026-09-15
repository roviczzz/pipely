import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/auth";
import { DealForm } from "@/components/crm/deal-form";
import { KanbanBoard } from "@/components/crm/kanban-board";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Deals | CRM Dashboard",
  description: "Manage your sales pipeline with a Kanban board view.",
  openGraph: {
    title: "Deals | CRM Dashboard",
    description: "Manage your sales pipeline with a Kanban board view.",
  },
};

type DealsPageProps = {
  searchParams?: Promise<{ edit?: string }> | { edit?: string };
};

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const editingId =
    typeof resolvedParams.edit === "string" ? resolvedParams.edit : null;

  const [deals, contacts, companies] = await Promise.all([
    prisma.deal.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        contact: { select: { firstName: true, lastName: true } },
        company: { select: { name: true } },
      },
    }),
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    }),
    prisma.company.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const editingDeal = editingId
    ? (deals.find((d) => d.id === editingId) ?? null)
    : null;

  const kanbanDeals = deals.map((d) => ({
    id: d.id,
    title: d.title,
    value: d.value,
    currency: d.currency,
    stage: d.stage,
    expectedCloseDate: d.expectedCloseDate,
    contactName: d.contact
      ? `${d.contact.firstName} ${d.contact.lastName}`
      : null,
    companyName: d.company?.name ?? null,
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Pipeline
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Deals</h1>
        </div>
      </header>

      <DealForm
        deal={editingDeal}
        contacts={contacts}
        companies={companies}
      />

      <Suspense
        fallback={
          <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading deals...
          </div>
        }
      >
        <KanbanBoard deals={kanbanDeals} />
      </Suspense>
    </div>
  );
}
