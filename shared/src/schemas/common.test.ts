import { amountSchema, currencySchema, hexColorSchema } from './common';

describe('amountSchema', () => {
  it('accepts positive integers', () => {
    expect(amountSchema.safeParse(1250).success).toBe(true);
  });

  it('rejects zero and negatives', () => {
    expect(amountSchema.safeParse(0).success).toBe(false);
    expect(amountSchema.safeParse(-10).success).toBe(false);
  });

  it('rejects fractional minor units', () => {
    expect(amountSchema.safeParse(12.5).success).toBe(false);
  });
});

describe('hexColorSchema', () => {
  it('accepts six digit hex colors', () => {
    expect(hexColorSchema.safeParse('#4F46e5').success).toBe(true);
  });

  it('rejects short or named colors', () => {
    expect(hexColorSchema.safeParse('#fff').success).toBe(false);
    expect(hexColorSchema.safeParse('red').success).toBe(false);
  });
});

describe('currencySchema', () => {
  it('rejects unsupported currencies', () => {
    expect(currencySchema.safeParse('XYZ').success).toBe(false);
  });
});
