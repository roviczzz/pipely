import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "password123";

async function getOrCreateCompany(
  name: string,
  data: { industry?: string; website?: string; size?: string }
) {
  const existing = await prisma.company.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.company.create({ data: { name, ...data } });
}

async function getOrCreateContact(
  email: string,
  data: {
    firstName: string;
    lastName: string;
    phone?: string | null;
    status?: string;
    companyId?: string | null;
  }
) {
  const existing = await prisma.contact.findUnique({ where: { email } });
  if (existing) return existing;
  return prisma.contact.create({
    data: { email, ...data, status: data.status ?? "LEAD" },
  });
}

async function getOrCreateDeal(
  title: string,
  data: {
    value: number;
    stage?: string;
    contactId?: string | null;
    companyId?: string | null;
    expectedCloseDate?: Date | null;
  }
) {
  const existing = await prisma.deal.findFirst({ where: { title } });
  if (existing) return existing;
  return prisma.deal.create({
    data: { title, ...data, stage: data.stage ?? "PROSPECT" },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      passwordHash,
      displayName: "Demo User",
    },
  });

  const acme = await getOrCreateCompany("Acme Corp", {
    industry: "Technology",
    website: "https://acme.example.com",
    size: "SIZE_51_200",
  });

  const globex = await getOrCreateCompany("Globex", {
    industry: "Manufacturing",
    website: "https://globex.example.com",
    size: "SIZE_1_10",
  });

  const alice = await getOrCreateContact("alice@acme.com", {
    firstName: "Alice",
    lastName: "Johnson",
    phone: "+1-555-0100",
    status: "ACTIVE",
    companyId: acme.id,
  });

  const bob = await getOrCreateContact("bob@globex.com", {
    firstName: "Bob",
    lastName: "Miller",
    phone: "+1-555-0101",
    status: "LEAD",
    companyId: globex.id,
  });

  await getOrCreateContact("carol@acme.com", {
    firstName: "Carol",
    lastName: "Ng",
    status: "INACTIVE",
    companyId: acme.id,
  });

  await getOrCreateDeal("Acme Enterprise License", {
    value: 50000,
    stage: "PROPOSAL",
    contactId: alice.id,
    companyId: acme.id,
    expectedCloseDate: new Date("2026-12-31"),
  });

  await getOrCreateDeal("Globex Onboarding", {
    value: 12000,
    stage: "PROSPECT",
    contactId: bob.id,
    companyId: globex.id,
  });

  await getOrCreateDeal("Acme Renewal", {
    value: 25000,
    stage: "NEGOTIATION",
    contactId: alice.id,
    companyId: acme.id,
    expectedCloseDate: new Date("2026-10-15"),
  });

  await getOrCreateDeal("Globex Add-ons", {
    value: 3000,
    stage: "CLOSED_WON",
    contactId: bob.id,
    companyId: globex.id,
  });

  console.log(`Seeded demo account ${user.email} (password: ${DEMO_PASSWORD}).`);
  console.log("Created demo companies, contacts, and deals.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });