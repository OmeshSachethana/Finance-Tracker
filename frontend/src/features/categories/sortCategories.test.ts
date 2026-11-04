import { sortCategories } from './sortCategories';

describe('sortCategories', () => {
  it('sorts by name with Other last', () => {
    const names = sortCategories([
      { name: 'Other' },
      { name: 'Transport' },
      { name: 'Groceries' },
      { name: 'Other Income' },
    ]).map((c) => c.name);
    expect(names).toEqual(['Groceries', 'Transport', 'Other', 'Other Income']);
  });
});
