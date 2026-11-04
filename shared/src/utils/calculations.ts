import type { Transaction } from '../schemas/transaction';

type Amounted = Pick<Transaction, 'type' | 'amount'>;

export interface Totals {
  income: number;
  expense: number;
  balance: number;
}

/** Sums income and expenses for a list of transactions. */
export function calculateTotals(transactions: Amounted[]): Totals {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

/** Percentage of income kept after expenses, rounded to one decimal. */
export function calculateSavingsRate({ income, expense }: Totals): number {
  if (income <= 0) return 0;
  return Math.round(((income - expense) / income) * 1000) / 10;
}

/** Sums transaction amounts per category id. */
export function sumByCategory(
  transactions: Pick<Transaction, 'categoryId' | 'amount'>[],
): Map<string, number> {
  const sums = new Map<string, number>();
  for (const t of transactions) {
    sums.set(t.categoryId, (sums.get(t.categoryId) ?? 0) + t.amount);
  }
  return sums;
}
