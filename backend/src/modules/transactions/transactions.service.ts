import type { CreateTransactionInput, Pagination } from '@finance-tracker/shared';
import { badRequest } from '../../lib/errors.ts';
import { toDbDate, toDbTransactionType } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';
import { getAccount } from '../accounts/accounts.service.ts';
import { getCategory } from '../categories/categories.service.ts';

type ParsedCreateInput = Required<Pick<CreateTransactionInput, 'tags'>> & CreateTransactionInput;

export async function createTransaction(userId: string, input: ParsedCreateInput) {
  const [category] = await Promise.all([
    getCategory(userId, input.categoryId),
    getAccount(userId, input.accountId),
  ]);
  const type = toDbTransactionType(input.type);
  if (category.type !== type) {
    throw badRequest('Category type does not match the transaction type');
  }

  return prisma.transaction.create({
    data: { ...input, type, date: toDbDate(input.date), userId },
  });
}

export async function listTransactions(userId: string, { page, pageSize }: Pagination) {
  const where = { userId };
  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);
  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
