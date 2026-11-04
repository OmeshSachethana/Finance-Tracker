import type { TransactionFilters } from '@finance-tracker/shared';
import type { Prisma } from '../../generated/prisma/client.ts';
import { toDbDate, toDbTransactionType } from '../../lib/mappers.ts';

/** Builds a Prisma where clause scoped to the user from list filters. */
export function buildTransactionWhere(
  userId: string,
  filters: TransactionFilters,
): Prisma.TransactionWhereInput {
  return {
    userId,
    type: filters.type ? toDbTransactionType(filters.type) : undefined,
    categoryId: filters.categoryId,
    accountId: filters.accountId,
    date:
      filters.from || filters.to
        ? {
            gte: filters.from ? toDbDate(filters.from) : undefined,
            lte: filters.to ? toDbDate(filters.to) : undefined,
          }
        : undefined,
    OR: filters.search
      ? [
          { description: { contains: filters.search, mode: 'insensitive' } },
          { notes: { contains: filters.search, mode: 'insensitive' } },
        ]
      : undefined,
    tags: filters.tag ? { has: filters.tag } : undefined,
  };
}
