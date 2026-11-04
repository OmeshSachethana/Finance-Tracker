import { getMonthRange, toISODate, toMonthKey } from './dates.ts';

describe('toISODate', () => {
  it('pads month and day', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('toMonthKey', () => {
  it('returns year and month', () => {
    expect(toMonthKey(new Date(2026, 10, 30))).toBe('2026-11');
  });
});

describe('getMonthRange', () => {
  it('returns first and last day of the month', () => {
    const { start, end } = getMonthRange(new Date(2026, 1, 14));
    expect(toISODate(start)).toBe('2026-02-01');
    expect(toISODate(end)).toBe('2026-02-28');
  });

  it('handles leap years', () => {
    const { end } = getMonthRange(new Date(2028, 1, 1));
    expect(toISODate(end)).toBe('2028-02-29');
  });
});
