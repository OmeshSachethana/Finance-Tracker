import type { CreateAccountInput, UpdateAccountInput } from '@finance-tracker/shared';
import { notFound } from '../../lib/errors.ts';
import { toDbAccountType } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';

/** Returns each account with its current balance (opening balance + income - expenses). */
export async function listAccounts(userId: string) {
  const [accounts, sums] = await Promise.all([
    prisma.account.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.transaction.groupBy({
      by: ['accountId', 'type'],
      where: { userId },
      _sum: { amount: true },
    }),
  ]);

  return accounts.map((account) => {
    const net = sums
      .filter((s) => s.accountId === account.id)
      .reduce((total, s) => {
        const amount = s._sum.amount ?? 0;
        return s.type === 'INCOME' ? total + amount : total - amount;
      }, 0);
    return { account, balance: account.openingBalance + net };
  });
}

export async function getAccount(userId: string, id: string) {
  const account = await prisma.account.findFirst({ where: { id, userId } });
  if (!account) throw notFound('Account not found');
  return account;
}

export function createAccount(userId: string, input: CreateAccountInput) {
  return prisma.account.create({
    data: { ...input, type: toDbAccountType(input.type), userId },
  });
}

export async function updateAccount(userId: string, id: string, input: UpdateAccountInput) {
  await getAccount(userId, id);
  return prisma.account.update({
    where: { id },
    data: { ...input, type: input.type ? toDbAccountType(input.type) : undefined },
  });
}
