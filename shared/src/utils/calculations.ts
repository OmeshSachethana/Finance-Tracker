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
