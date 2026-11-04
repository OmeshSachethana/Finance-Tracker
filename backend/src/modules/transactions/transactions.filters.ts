import type { TransactionFilters } from '@finance-tracker/shared';
import type { Prisma } from '../../generated/prisma/client.ts';
import { toDbTransactionType } from '../../lib/mappers.ts';

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
  };
}
