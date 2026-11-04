import type { Transaction as TransactionDto } from '@finance-tracker/shared';
import type { Transaction } from '../../generated/prisma/client.ts';
import { fromDbDate, fromDbTransactionType } from '../../lib/mappers.ts';

export function toTransactionDto(transaction: Transaction): TransactionDto {
  return {
    id: transaction.id,
    type: fromDbTransactionType(transaction.type),
    amount: transaction.amount,
    date: fromDbDate(transaction.date),
    description: transaction.description,
    notes: transaction.notes ?? undefined,
    tags: transaction.tags,
    categoryId: transaction.categoryId,
    accountId: transaction.accountId,
  };
}
