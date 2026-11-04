import { lastMonthKeys, previousMonthKey } from './months.ts';

describe('lastMonthKeys', () => {
  it('returns months oldest first', () => {
    expect(lastMonthKeys(3, new Date(2026, 10, 15))).toEqual(['2026-09', '2026-10', '2026-11']);
  });

  it('crosses year boundaries', () => {
    expect(lastMonthKeys(3, new Date(2027, 0, 5))).toEqual(['2026-11', '2026-12', '2027-01']);
  });
});

describe('previousMonthKey', () => {
  it('goes back one month', () => {
    expect(previousMonthKey('2026-11')).toBe('2026-10');
  });

  it('wraps to December of the previous year', () => {
    expect(previousMonthKey('2026-01')).toBe('2025-12');
  });
});
