import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CompanyForm } from "@/components/crm/company-form";
import { CompanyTable } from "@/components/crm/company-table";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Companies | CRM Dashboard",
  description: "Manage company records, sizes, and account relationships.",
  openGraph: {
    title: "Companies | CRM Dashboard",
    description: "Manage company records, sizes, and account relationships.",
  },
};

type CompaniesPageProps = {
  searchParams?: Promise<{ edit?: string }> | { edit?: string };
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const editingId = typeof resolvedParams.edit === "string" ? resolvedParams.edit : null;

  const [companies, contacts] = await Promise.all([
    prisma.company.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        contacts: {
          select: { id: true },
        },
      },
    }),
    prisma.contact.findMany({
      select: { id: true, companyId: true },
    }),
  ]);

  const editingCompany = editingId
    ? companies.find((company) => company.id === editingId) ?? null
    : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Accounts
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Companies</h1>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <CompanyForm company={editingCompany} />
        <CompanyTable
          companies={companies.map((company) => ({
            id: company.id,
            name: company.name,
            industry: company.industry,
            website: company.website,
            size: company.size,
            contactCount: contacts.filter((contact) => contact.companyId === company.id).length,
          }))}
        />
      </div>
    </div>
  );
}
