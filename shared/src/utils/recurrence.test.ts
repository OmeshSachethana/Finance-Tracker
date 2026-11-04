import { nextOccurrence } from './recurrence.ts';

describe('nextOccurrence', () => {
  it('adds a day', () => {
    expect(nextOccurrence('2026-12-31', 'daily')).toBe('2027-01-01');
  });

  it('adds a week', () => {
    expect(nextOccurrence('2026-11-04', 'weekly')).toBe('2026-11-11');
  });

  it('adds a month', () => {
    expect(nextOccurrence('2026-11-15', 'monthly')).toBe('2026-12-15');
  });

  it('adds a year', () => {
    expect(nextOccurrence('2026-03-01', 'yearly')).toBe('2027-03-01');
  });
});

describe('nextOccurrence at month ends', () => {
  it('keeps the 31st clamped to shorter months', () => {
    expect(nextOccurrence('2026-01-31', 'monthly')).toBe('2026-02-28');
  });

  it('returns to the anchor day in longer months', () => {
    expect(nextOccurrence('2026-02-28', 'monthly', 31)).toBe('2026-03-31');
  });

  it('handles leap day yearly rules', () => {
    expect(nextOccurrence('2028-02-29', 'yearly')).toBe('2029-02-28');
  });
});
