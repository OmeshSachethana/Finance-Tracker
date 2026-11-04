import {
  fromDbAccountType,
  fromDbTransactionType,
  toDbAccountType,
  toDbTransactionType,
} from './mappers.ts';

describe('transaction type mappers', () => {
  it('round-trips both types', () => {
    expect(fromDbTransactionType(toDbTransactionType('income'))).toBe('income');
    expect(fromDbTransactionType(toDbTransactionType('expense'))).toBe('expense');
  });
});

describe('account type mappers', () => {
  it('maps snake case to database enums', () => {
    expect(toDbAccountType('credit_card')).toBe('CREDIT_CARD');
    expect(fromDbAccountType('CREDIT_CARD')).toBe('credit_card');
  });
});
