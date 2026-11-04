import { comparisonRange, monthToRange, shiftMonth } from './months';

describe('monthToRange', () => {
  it('covers the whole month', () => {
    expect(monthToRange('2026-02')).toEqual({ from: '2026-02-01', to: '2026-02-28' });
  });
});

describe('shiftMonth', () => {
  it('moves across year boundaries', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
  });
});

describe('comparisonRange', () => {
  it('uses the full previous month for past months', () => {
    expect(comparisonRange('2026-10', new Date(2026, 10, 4))).toEqual({
      from: '2026-09-01',
      to: '2026-09-30',
    });
  });

  it('uses the same days of last month for the current month', () => {
    expect(comparisonRange('2026-11', new Date(2026, 10, 4))).toEqual({
      from: '2026-10-01',
      to: '2026-10-04',
    });
  });

  it('clamps to shorter previous months', () => {
    expect(comparisonRange('2026-03', new Date(2026, 2, 31)).to).toBe('2026-02-28');
  });
});
