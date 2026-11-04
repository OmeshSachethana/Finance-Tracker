import { createBudgetSchema, monthKeySchema } from './budget';

describe('monthKeySchema', () => {
  it('accepts YYYY-MM', () => {
    expect(monthKeySchema.safeParse('2026-11').success).toBe(true);
  });

  it('rejects invalid months', () => {
    expect(monthKeySchema.safeParse('2026-13').success).toBe(false);
    expect(monthKeySchema.safeParse('2026-1').success).toBe(false);
  });
});

describe('createBudgetSchema', () => {
  it('defaults the alert threshold to 80 percent', () => {
    const budget = createBudgetSchema.parse({
      categoryId: '7d0c1b8e-5d1f-4a5e-9b1a-3f2a4b5c6d7e',
      month: '2026-11',
      limit: 50000,
    });
    expect(budget.alertThreshold).toBe(80);
  });
});
