import { createCategorySchema } from './category';

describe('createCategorySchema', () => {
  const valid = { name: 'Food', type: 'expense', color: '#f97316', icon: 'utensils' };

  it('accepts a valid category', () => {
    expect(createCategorySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects names that are too long', () => {
    expect(createCategorySchema.safeParse({ ...valid, name: 'x'.repeat(41) }).success).toBe(false);
  });
});
