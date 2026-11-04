import { toMinorUnits } from './money';

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
