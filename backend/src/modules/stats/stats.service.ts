import { calculateSavingsRate, calculateTotals, type DateRange } from '@finance-tracker/shared';
import { toDbDate } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';

/** Income, expenses, balance and savings rate for a date range. */
export async function getSummary(userId: string, { from, to }: DateRange) {
  const groups = await prisma.transaction.groupBy({
    by: ['type'],
    where: { userId, date: { gte: toDbDate(from), lte: toDbDate(to) } },
    _sum: { amount: true },
    _count: true,
  });

  const totals = calculateTotals(
    groups.map((g) => ({
      type: g.type === 'INCOME' ? 'income' : 'expense',
      amount: g._sum.amount ?? 0,
    })),
  );
  const count = groups.reduce((sum, g) => sum + g._count, 0);
  return { ...totals, savingsRate: calculateSavingsRate(totals), count };
}
