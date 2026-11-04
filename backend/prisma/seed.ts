import { DEFAULT_CATEGORIES } from '@finance-tracker/shared';
import { hashPassword } from '../src/lib/password.ts';
import { prisma } from '../src/lib/prisma.ts';

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

async function main() {
  await upsertUser(ADMIN_EMAIL, 'Admin', 'ADMIN');
  await upsertUser(DEMO_EMAIL, 'Demo User', 'USER');
  console.log(`Seeded ${ADMIN_EMAIL} and ${DEMO_EMAIL} (password: ${PASSWORD})`);
}

await main();
await prisma.$disconnect();
