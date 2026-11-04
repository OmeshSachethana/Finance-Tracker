import type { AccountType, TransactionType } from '@finance-tracker/shared';
import type {
  AccountType as DbAccountType,
  TransactionType as DbTransactionType,
} from '../generated/prisma/client.ts';

export function toDbTransactionType(type: TransactionType): DbTransactionType {
  return type === 'income' ? 'INCOME' : 'EXPENSE';
}

export function fromDbTransactionType(type: DbTransactionType): TransactionType {
  return type === 'INCOME' ? 'income' : 'expense';
}

export function toDbAccountType(type: AccountType): DbAccountType {
  return type.toUpperCase() as DbAccountType;
}

export function fromDbAccountType(type: DbAccountType): AccountType {
  return type.toLowerCase() as AccountType;
}

/** Converts a database DATE value to YYYY-MM-DD. */
export function fromDbDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Converts YYYY-MM-DD to a Date at UTC midnight for a DATE column. */
export function toDbDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}
