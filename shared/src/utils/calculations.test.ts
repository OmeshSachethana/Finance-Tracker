import { calculateTotals } from './calculations';

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
