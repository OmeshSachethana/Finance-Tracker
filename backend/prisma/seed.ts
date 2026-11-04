import { DEFAULT_CATEGORIES } from '@finance-tracker/shared';
import { hashPassword } from '../src/lib/password.ts';
import { prisma } from '../src/lib/prisma.ts';
import { generateSampleTransactions } from './seed-data.ts';

const DEMO_EMAIL = 'demo@example.com';
const ADMIN_EMAIL = 'admin@example.com';
const PASSWORD = 'Password123';

async function upsertUser(email: string, name: string, role: 'USER' | 'ADMIN') {
  const passwordHash = await hashPassword(PASSWORD);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      role,
      passwordHash,
      accounts: { create: { name: 'Cash', type: 'CASH', currency: 'USD', color: '#22c55e' } },
      categories: {
        create: DEFAULT_CATEGORIES.map((c) => ({
          name: c.name,
          type: c.type === 'income' ? 'INCOME' : 'EXPENSE',
          color: c.color,
          icon: c.icon,
        })),
      },
    },
  });
}

async function seedDemoData(userId: string) {
  if ((await prisma.transaction.count({ where: { userId } })) > 0) return;

  const [account, categories] = await Promise.all([
    prisma.account.findFirstOrThrow({ where: { userId } }),
    prisma.category.findMany({ where: { userId } }),
  ]);
  const categoryId = (name: string) => categories.find((c) => c.name === name)!.id;

  await prisma.transaction.createMany({
    data: generateSampleTransactions().map((t) => ({
      userId,
      accountId: account.id,
      categoryId: categoryId(t.category),
      type: t.type,
      amount: t.amount,
      description: t.description,
      date: new Date(),
    })),
  });
}

async function main() {
  await upsertUser(ADMIN_EMAIL, 'Admin', 'ADMIN');
  const demo = await upsertUser(DEMO_EMAIL, 'Demo User', 'USER');
  await seedDemoData(demo.id);
  console.log(`Seeded ${ADMIN_EMAIL} and ${DEMO_EMAIL} (password: ${PASSWORD})`);
}

await main();
await prisma.$disconnect();
