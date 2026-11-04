import { createTransactionSchema, transactionSortSchema } from './transaction';

const valid = {
  type: 'expense',
  amount: 1599,
  date: '2026-11-04',
  description: 'Groceries',
  categoryId: '7d0c1b8e-5d1f-4a5e-9b1a-3f2a4b5c6d7e',
  accountId: '0f8fad5b-d9cb-469f-a165-70867728950e',
};

describe('createTransactionSchema', () => {
  it('accepts a valid transaction', () => {
    expect(createTransactionSchema.safeParse(valid).success).toBe(true);
  });

  it('defaults tags to an empty list', () => {
    expect(createTransactionSchema.parse(valid).tags).toEqual([]);
  });

  it('trims the description', () => {
    const result = createTransactionSchema.parse({ ...valid, description: '  Rent  ' });
    expect(result.description).toBe('Rent');
  });

  it('rejects an invalid date', () => {
    expect(createTransactionSchema.safeParse({ ...valid, date: '2026-13-01' }).success).toBe(false);
  });

  it('rejects an unknown type', () => {
    expect(createTransactionSchema.safeParse({ ...valid, type: 'transfer' }).success).toBe(false);
  });
});

describe('transactionSortSchema', () => {
  it('sorts by newest date by default', () => {
    expect(transactionSortSchema.parse({})).toEqual({ sortBy: 'date', order: 'desc' });
  });
});
