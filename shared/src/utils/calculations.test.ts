import {
  calculateSavingsRate,
  calculateTotals,
  sumByCategory,
  totalsByMonth,
} from './calculations';

describe('calculateTotals', () => {
  it('returns zeros for no transactions', () => {
    expect(calculateTotals([])).toEqual({ income: 0, expense: 0, balance: 0 });
  });

  it('sums income and expenses separately', () => {
    const totals = calculateTotals([
      { type: 'income', amount: 500000 },
      { type: 'expense', amount: 120000 },
      { type: 'expense', amount: 30000 },
    ]);
    expect(totals).toEqual({ income: 500000, expense: 150000, balance: 350000 });
  });
});

describe('calculateSavingsRate', () => {
  it('returns 0 without income', () => {
    expect(calculateSavingsRate({ income: 0, expense: 500, balance: -500 })).toBe(0);
  });

  it('returns the share of income saved', () => {
    expect(calculateSavingsRate({ income: 3000, expense: 1000, balance: 2000 })).toBe(66.7);
  });

  it('can be negative when overspending', () => {
    expect(calculateSavingsRate({ income: 1000, expense: 1500, balance: -500 })).toBe(-50);
  });
});

describe('sumByCategory', () => {
  it('groups amounts by category', () => {
    const sums = sumByCategory([
      { categoryId: 'food', amount: 100 },
      { categoryId: 'rent', amount: 900 },
      { categoryId: 'food', amount: 50 },
    ]);
    expect(sums.get('food')).toBe(150);
    expect(sums.get('rent')).toBe(900);
  });
});

describe('totalsByMonth', () => {
  it('groups totals by month', () => {
    const months = totalsByMonth([
      { type: 'income', amount: 1000, date: '2026-10-01' },
      { type: 'expense', amount: 200, date: '2026-10-15' },
      { type: 'expense', amount: 300, date: '2026-11-02' },
    ]);
    expect(months.get('2026-10')).toEqual({ income: 1000, expense: 200, balance: 800 });
    expect(months.get('2026-11')).toEqual({ income: 0, expense: 300, balance: -300 });
  });
});
