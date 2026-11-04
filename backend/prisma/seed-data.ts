import { toISODate } from '@finance-tracker/shared';

export interface SampleTransaction {
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  amount: number;
  date: string;
}

const EXPENSES: [category: string, description: string, min: number, max: number][] = [
  ['Groceries', 'Supermarket', 2500, 12000],
  ['Food & Dining', 'Lunch out', 900, 2500],
  ['Food & Dining', 'Coffee', 350, 650],
  ['Transport', 'Fuel', 3000, 6000],
  ['Transport', 'Bus pass', 1500, 1500],
  ['Entertainment', 'Cinema', 1200, 2400],
  ['Shopping', 'Clothes', 2000, 9000],
  ['Health', 'Pharmacy', 800, 3500],
];

/** Deterministic pseudo-random numbers so the demo data is the same every run. */
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/** Generates roughly three months of realistic transactions ending today. */
export function generateSampleTransactions(today = new Date()): SampleTransaction[] {
  const random = seededRandom(42);
  const items: SampleTransaction[] = [];

  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const month = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
    const day = (d: number) => toISODate(new Date(month.getFullYear(), month.getMonth(), d));
    const lastDay = monthOffset === 0 ? today.getDate() : 28;

    items.push({
      type: 'INCOME',
      category: 'Salary',
      description: 'Monthly salary',
      amount: 450000,
      date: day(1),
    });
    items.push({
      type: 'EXPENSE',
      category: 'Housing',
      description: 'Rent',
      amount: 150000,
      date: day(2),
    });
    if (lastDay >= 10) {
      items.push({
        type: 'EXPENSE',
        category: 'Utilities',
        description: 'Electricity bill',
        amount: 8500,
        date: day(10),
      });
    }

    for (let d = 3; d <= lastDay; d += 1 + Math.floor(random() * 3)) {
      const [category, description, min, max] = EXPENSES[Math.floor(random() * EXPENSES.length)]!;
      const amount = Math.round((min + random() * (max - min)) / 50) * 50;
      items.push({ type: 'EXPENSE', category, description, amount, date: day(d) });
    }
  }
  return items;
}

/** Demo monthly limits in minor units: [category, limit]. */
export const DEMO_BUDGETS: [category: string, limit: number][] = [
  ['Housing', 160000],
  ['Groceries', 40000],
  ['Food & Dining', 15000],
  ['Transport', 20000],
  ['Entertainment', 8000],
];
