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
