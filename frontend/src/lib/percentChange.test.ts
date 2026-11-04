import { percentChange } from './percentChange';

describe('percentChange', () => {
  it('computes increases and decreases', () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
  });

  it('returns null without a baseline', () => {
    expect(percentChange(100, 0)).toBeNull();
    expect(percentChange(100, undefined)).toBeNull();
  });
});
