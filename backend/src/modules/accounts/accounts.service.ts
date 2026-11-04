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
