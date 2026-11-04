import { getMonthRange } from '@finance-tracker/shared';
import { toDbDate } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';

function monthBounds(month: string) {
  const [year, m] = month.split('-').map(Number) as [number, number];
  const { end } = getMonthRange(new Date(year, m - 1, 1));
  return {
    gte: toDbDate(`${month}-01`),
    lte: toDbDate(`${month}-${String(end.getDate()).padStart(2, '0')}`),
  };
}

/** Budgets for a month with how much has been spent in each category. */
export async function listBudgets(userId: string, month: string) {
  const [budgets, spending] = await Promise.all([
    prisma.budget.findMany({ where: { userId, month }, orderBy: { createdAt: 'asc' } }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'EXPENSE', date: monthBounds(month) },
      _sum: { amount: true },
    }),
  ]);
  const spentBy = new Map(spending.map((s) => [s.categoryId, s._sum.amount ?? 0]));
  return budgets.map((budget) => ({ budget, spent: spentBy.get(budget.categoryId) ?? 0 }));
}
