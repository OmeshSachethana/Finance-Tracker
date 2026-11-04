import { daysUntil } from './GoalCard';

describe('daysUntil', () => {
  const today = new Date(2026, 10, 4);

  it('counts days to a future date', () => {
    expect(daysUntil('2026-11-14', today)).toBe(10);
  });

  it('is zero today and negative in the past', () => {
    expect(daysUntil('2026-11-04', today)).toBe(0);
    expect(daysUntil('2026-11-01', today)).toBe(-3);
  });
});
