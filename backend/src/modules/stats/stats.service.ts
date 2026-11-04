import {
  calculateSavingsRate,
  calculateTotals,
  type CategoryBreakdownItem,
  type DateRange,
  type TransactionType,
} from '@finance-tracker/shared';
import { toDbDate, toDbTransactionType } from '../../lib/mappers.ts';
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

/** Totals per category for a type and date range, largest first. */
export async function getCategoryBreakdown(
  userId: string,
  { from, to, type }: DateRange & { type: TransactionType },
): Promise<CategoryBreakdownItem[]> {
  const groups = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      type: toDbTransactionType(type),
      date: { gte: toDbDate(from), lte: toDbDate(to) },
    },
    _sum: { amount: true },
    _count: true,
  });

  return groups
    .map((g) => ({ categoryId: g.categoryId, total: g._sum.amount ?? 0, count: g._count }))
    .sort((a, b) => b.total - a.total);
}
