import type { TransactionType } from '@finance-tracker/shared';
import type { TransactionType as DbTransactionType } from '../generated/prisma/client.ts';

export function toDbTransactionType(type: TransactionType): DbTransactionType {
  return type === 'income' ? 'INCOME' : 'EXPENSE';
}

export function fromDbTransactionType(type: DbTransactionType): TransactionType {
  return type === 'INCOME' ? 'income' : 'expense';
}
