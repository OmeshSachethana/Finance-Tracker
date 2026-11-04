import { formatDate, formatMonth } from './dates';

describe('formatDate', () => {
  it('formats ISO dates without shifting the day', () => {
    expect(formatDate('2026-11-01')).toBe('1 Nov 2026');
  });
});

describe('formatMonth', () => {
  it('formats month keys', () => {
    expect(formatMonth('2026-02')).toBe('Feb 2026');
  });
});
