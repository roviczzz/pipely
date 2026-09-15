import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BriefcaseBusiness, Building2, ContactRound, TrendingUp } from "lucide-react";

import { auth } from "@/auth";
import { MetricCard } from "@/components/admin/metric-card";
import { RecentActivity } from "@/components/admin/recent-activity";
import { buildRecentActivity, getOpenDealCount } from "@/lib/dashboard";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard | CRM Dashboard",
  description: "Summary of contacts, companies, deals, and recent CRM activity.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [contactsCount, companiesCount, deals, recentContacts, recentCompanies, recentDeals] =
    await Promise.all([
      prisma.contact.count(),
      prisma.company.count(),
      prisma.deal.findMany({ select: { stage: true } }),
      prisma.contact.findMany({
        select: { id: true, firstName: true, lastName: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.company.findMany({
        select: { id: true, name: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.deal.findMany({
        select: { id: true, title: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

  const openDeals = getOpenDealCount(deals);
  const activity = buildRecentActivity([
    ...recentContacts.map((contact) => ({
      id: contact.id,
      type: "Contact" as const,
      title: `${contact.firstName} ${contact.lastName}`,
      updatedAt: contact.updatedAt,
    })),
    ...recentCompanies.map((company) => ({
      id: company.id,
      type: "Company" as const,
      title: company.name,
      updatedAt: company.updatedAt,
    })),
    ...recentDeals.map((deal) => ({
      id: deal.id,
      type: "Deal" as const,
      title: deal.title,
      updatedAt: deal.updatedAt,
    })),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{session.user.name ?? "CRM user"}</span>
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Contacts"
          value={contactsCount}
          helper="Total people in your CRM"
          icon={<ContactRound className="h-5 w-5" />}
          accentClassName="bg-sky-100 text-sky-700"
        />
        <MetricCard
          label="Companies"
          value={companiesCount}
          helper="Active business accounts"
          icon={<Building2 className="h-5 w-5" />}
          accentClassName="bg-violet-100 text-violet-700"
        />
        <MetricCard
          label="Open deals"
          value={openDeals}
          helper="Deals still in play"
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          accentClassName="bg-emerald-100 text-emerald-700"
        />
        <MetricCard
          label="Pipeline health"
          value={`${Math.min(Math.max(Math.round((openDeals / Math.max(contactsCount + companiesCount, 1)) * 100), 0), 100)}%`}
          helper="Weighted against your current records"
          icon={<TrendingUp className="h-5 w-5" />}
          accentClassName="bg-amber-100 text-amber-700"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Sales snapshot</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Total contacts</p>
              <p className="mt-2 text-2xl font-semibold">{contactsCount}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Open pipeline</p>
              <p className="mt-2 text-2xl font-semibold">{openDeals}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Record coverage</p>
              <p className="mt-2 text-2xl font-semibold">{companiesCount} companies</p>
            </div>
          </div>
        </div>

        <RecentActivity items={activity} />
      </section>
    </div>
  );
}
