import {
  calculateSavingsRate,
  calculateTotals,
  lastMonthKeys,
  totalsByMonth,
  type CategoryBreakdownItem,
  type DateRange,
  type MonthlyTrendItem,
  type TransactionType,
} from '@finance-tracker/shared';
import {
  fromDbDate,
  fromDbTransactionType,
  toDbDate,
  toDbTransactionType,
} from '../../lib/mappers.ts';
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

/** Income and expenses for each of the last `months` months, including empty months. */
export async function getMonthlyTrend(
  userId: string,
  months: number,
  now = new Date(),
): Promise<MonthlyTrendItem[]> {
  const keys = lastMonthKeys(months, now);
  const from = toDbDate(`${keys[0]}-01`);
  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: from } },
    select: { type: true, amount: true, date: true },
  });

  const byMonth = totalsByMonth(
    transactions.map((t) => ({
      type: fromDbTransactionType(t.type),
      amount: t.amount,
      date: fromDbDate(t.date),
    })),
  );
  return keys.map((month) => {
    const totals = byMonth.get(month);
    return { month, income: totals?.income ?? 0, expense: totals?.expense ?? 0 };
  });
}
