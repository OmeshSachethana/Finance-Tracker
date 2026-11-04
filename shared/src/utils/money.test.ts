import { formatMoney, fromMinorUnits, toMinorUnits } from './money.ts';

describe('toMinorUnits', () => {
  it('converts dollars to cents', () => {
    expect(toMinorUnits(12.34, 'USD')).toBe(1234);
  });

  it('rounds floating point errors', () => {
    expect(toMinorUnits(0.1 + 0.2, 'USD')).toBe(30);
  });

  it('handles zero-decimal currencies', () => {
    expect(toMinorUnits(500, 'JPY')).toBe(500);
  });
});

describe('fromMinorUnits', () => {
  it('converts cents to dollars', () => {
    expect(fromMinorUnits(1234, 'USD')).toBe(12.34);
  });

  it('handles zero-decimal currencies', () => {
    expect(fromMinorUnits(500, 'JPY')).toBe(500);
  });
});

describe('formatMoney', () => {
  it('formats USD with two decimals', () => {
    expect(formatMoney(123456, 'USD')).toBe('$1,234.56');
  });

  it('formats negative amounts', () => {
    expect(formatMoney(-500, 'USD')).toBe('-$5.00');
  });

  it('formats JPY without decimals', () => {
    expect(formatMoney(1500, 'JPY')).toBe('¥1,500');
  });
});
