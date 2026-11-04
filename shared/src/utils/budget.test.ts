import { getBudgetProgress } from './budget.ts';

describe('getBudgetProgress', () => {
  it('is ok below the threshold', () => {
    expect(getBudgetProgress(1000, 500)).toEqual({
      spent: 500,
      remaining: 500,
      percent: 50,
      status: 'ok',
    });
  });

  it('warns at the threshold', () => {
    expect(getBudgetProgress(1000, 800).status).toBe('warning');
  });

  it('respects a custom threshold', () => {
    expect(getBudgetProgress(1000, 600, 60).status).toBe('warning');
  });

  it('warns but is not exceeded at exactly the limit', () => {
    expect(getBudgetProgress(1000, 1000).status).toBe('warning');
  });

  it('is exceeded when spending passes the limit', () => {
    const progress = getBudgetProgress(1000, 1200);
    expect(progress.status).toBe('exceeded');
    expect(progress.remaining).toBe(-200);
  });
});
