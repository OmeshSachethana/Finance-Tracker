import {
  getMonthRange,
  type CreateBudgetInput,
  type UpdateBudgetInput,
} from '@finance-tracker/shared';
import { badRequest, conflict, notFound } from '../../lib/errors.ts';
import { toDbDate } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';
import { getCategory } from '../categories/categories.service.ts';

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

export async function createBudget(userId: string, input: CreateBudgetInput) {
  const category = await getCategory(userId, input.categoryId);
  if (category.type !== 'EXPENSE')
    throw badRequest('Budgets can only be set for expense categories');

  const existing = await prisma.budget.findUnique({
    where: {
      userId_categoryId_month: { userId, categoryId: input.categoryId, month: input.month },
    },
  });
  if (existing) throw conflict('This category already has a budget for that month');

  return prisma.budget.create({ data: { ...input, userId } });
}

async function getBudget(userId: string, id: string) {
  const budget = await prisma.budget.findFirst({ where: { id, userId } });
  if (!budget) throw notFound('Budget not found');
  return budget;
}

export async function updateBudget(userId: string, id: string, input: UpdateBudgetInput) {
  await getBudget(userId, id);
  return prisma.budget.update({ where: { id }, data: input });
}

export async function deleteBudget(userId: string, id: string) {
  await getBudget(userId, id);
  await prisma.budget.delete({ where: { id } });
}
