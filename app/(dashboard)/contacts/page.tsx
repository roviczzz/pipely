import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ContactForm } from "@/components/crm/contact-form";
import { ContactTable } from "@/components/crm/contact-table";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contacts | CRM Dashboard",
  description: "Manage contacts and company associations.",
  openGraph: {
    title: "Contacts | CRM Dashboard",
    description: "Manage contacts and company associations.",
  },
};

type ContactsPageProps = {
  searchParams?: Promise<{ edit?: string }> | { edit?: string };
};

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const editingId = typeof resolvedParams.edit === "string" ? resolvedParams.edit : null;

  const [contacts, companies] = await Promise.all([
    prisma.contact.findMany({
      orderBy: { updatedAt: "desc" },
      include: { company: { select: { name: true } } },
    }),
    prisma.company.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const editingContact = editingId
    ? contacts.find((contact) => contact.id === editingId) ?? null
    : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Customers
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <ContactForm companies={companies} contact={editingContact} />
        <ContactTable
          contacts={contacts.map((contact) => ({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            status: contact.status,
            company: contact.company,
          }))}
        />
      </div>
    </div>
  );
}
