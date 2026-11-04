import {
  fromMinorUnits,
  type CurrencyCode,
  type TransactionFilters,
} from '@finance-tracker/shared';
import { toCsv } from '../../lib/csv.ts';
import { fromDbDate } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';
import { buildTransactionWhere } from './transactions.filters.ts';

/** Builds a CSV of the user's transactions matching the filters, oldest first. */
export async function exportTransactionsCsv(userId: string, filters: TransactionFilters) {
  const transactions = await prisma.transaction.findMany({
    where: buildTransactionWhere(userId, filters),
    include: { category: true, account: true },
    orderBy: { date: 'asc' },
  });

  const rows = transactions.map((t) => [
    fromDbDate(t.date),
    t.type === 'INCOME' ? 'income' : 'expense',
    t.description,
    t.category.name,
    t.account.name,
    fromMinorUnits(t.amount, t.account.currency as CurrencyCode),
    t.account.currency,
    t.tags.join(';'),
    t.notes,
  ]);

  return toCsv(
    ['Date', 'Type', 'Description', 'Category', 'Account', 'Amount', 'Currency', 'Tags', 'Notes'],
    rows,
  );
}
