import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash,
      displayName: 'Demo User',
    },
  });
  
  const company = await prisma.company.create({
    data: {
      name: 'Acme Corp',
      industry: 'Technology',
      size: 'SIZE_51_200',
    }
  });

  const contact = await prisma.contact.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      companyId: company.id,
      status: 'ACTIVE',
    }
  });

  await prisma.deal.create({
    data: {
      title: 'Acme Enterprise License',
      value: 50000,
      stage: 'PROPOSAL',
      companyId: company.id,
      contactId: contact.id,
    }
  });

  console.log('Seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });