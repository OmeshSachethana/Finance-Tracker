import { formatAmountInput, parseAmountInput } from './amount';

describe('parseAmountInput', () => {
  it('parses decimals into cents', () => {
    expect(parseAmountInput('12.5', 'USD')).toBe(1250);
  });

  it('ignores thousands separators and spaces', () => {
    expect(parseAmountInput(' 1,234.56 ', 'USD')).toBe(123456);
  });

  it('rejects invalid input', () => {
    expect(parseAmountInput('abc', 'USD')).toBeNull();
    expect(parseAmountInput('1.234', 'USD')).toBeNull();
    expect(parseAmountInput('-5', 'USD')).toBeNull();
  });
});

describe('formatAmountInput', () => {
  it('formats cents for editing', () => {
    expect(formatAmountInput(1250, 'USD')).toBe('12.5');
  });
});
