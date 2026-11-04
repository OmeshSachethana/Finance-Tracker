import type {
  CreateTransactionInput,
  Pagination,
  TransactionFilters,
  TransactionSort,
  UpdateTransactionInput,
} from '@finance-tracker/shared';
import { badRequest, notFound } from '../../lib/errors.ts';
import { toDbDate, toDbTransactionType } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';
import { getAccount } from '../accounts/accounts.service.ts';
import { getCategory } from '../categories/categories.service.ts';
import { buildTransactionWhere } from './transactions.filters.ts';

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

export async function listTransactions(
  userId: string,
  { page, pageSize, sortBy, order, ...filters }: Pagination & TransactionFilters & TransactionSort,
) {
  const where = buildTransactionWhere(userId, filters);
  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: [{ [sortBy]: order }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);
  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getTransaction(userId: string, id: string) {
  const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!transaction) throw notFound('Transaction not found');
  return transaction;
}

export async function updateTransaction(userId: string, id: string, input: UpdateTransactionInput) {
  const current = await getTransaction(userId, id);
  const categoryId = input.categoryId ?? current.categoryId;
  const type = input.type ? toDbTransactionType(input.type) : current.type;

  const [category] = await Promise.all([
    getCategory(userId, categoryId),
    input.accountId ? getAccount(userId, input.accountId) : null,
  ]);
  if (category.type !== type) {
    throw badRequest('Category type does not match the transaction type');
  }

  return prisma.transaction.update({
    where: { id },
    data: { ...input, type, date: input.date ? toDbDate(input.date) : undefined },
  });
}

export async function deleteTransaction(userId: string, id: string) {
  await getTransaction(userId, id);
  await prisma.transaction.delete({ where: { id } });
}

/** Deletes several of the user's transactions and returns how many were removed. */
export async function deleteTransactions(userId: string, ids: string[]) {
  const { count } = await prisma.transaction.deleteMany({ where: { userId, id: { in: ids } } });
  return count;
}
