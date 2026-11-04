import { presetToRange } from './rangePresets';

const today = new Date(2026, 10, 4);

describe('presetToRange', () => {
  it('covers this month', () => {
    expect(presetToRange('this-month', today)).toEqual({ from: '2026-11-01', to: '2026-11-30' });
  });

  it('covers last month', () => {
    expect(presetToRange('last-month', today)).toEqual({ from: '2026-10-01', to: '2026-10-31' });
  });

  it('covers the last three months including this one', () => {
    expect(presetToRange('last-3-months', today)).toEqual({ from: '2026-09-01', to: '2026-11-30' });
  });

  it('covers whole years', () => {
    expect(presetToRange('this-year', today)).toEqual({ from: '2026-01-01', to: '2026-12-31' });
    expect(presetToRange('last-year', today)).toEqual({ from: '2025-01-01', to: '2025-12-31' });
  });

  it('handles January for last month', () => {
    expect(presetToRange('last-month', new Date(2027, 0, 10))).toEqual({
      from: '2026-12-01',
      to: '2026-12-31',
    });
  });
});
