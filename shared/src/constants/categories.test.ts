import { createCategorySchema } from '../schemas/category.ts';
import { DEFAULT_CATEGORIES } from './categories.ts';

describe('DEFAULT_CATEGORIES', () => {
  it('are all valid categories', () => {
    for (const category of DEFAULT_CATEGORIES) {
      expect(createCategorySchema.safeParse(category).success).toBe(true);
    }
  });

  it('have unique names', () => {
    const names = DEFAULT_CATEGORIES.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
