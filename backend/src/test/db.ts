import { prisma } from '../lib/prisma.ts';

/** Removes all rows so each test starts from an empty database. */
export async function resetDatabase() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "transactions", "recurring_rules", "budgets", "goals", "categories", "accounts", "refresh_tokens", "users" CASCADE',
  );
}
