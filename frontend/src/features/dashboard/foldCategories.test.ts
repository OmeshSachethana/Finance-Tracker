import { foldCategories } from './foldCategories';

const names = new Map(
  Array.from({ length: 8 }, (_, i) => [`c${i}`, { name: `Cat ${i}`, color: '#000000' }]),
);

describe('foldCategories', () => {
  it('keeps short lists as they are', () => {
    const rows = foldCategories([{ categoryId: 'c0', total: 100, count: 1 }], names);
    expect(rows).toEqual([{ id: 'c0', name: 'Cat 0', color: '#000000', total: 100 }]);
  });

  it('folds the tail into Other', () => {
    const items = Array.from({ length: 8 }, (_, i) => ({
      categoryId: `c${i}`,
      total: 80 - i * 10,
      count: 1,
    }));
    const rows = foldCategories(items, names);
    expect(rows).toHaveLength(6);
    expect(rows[5]).toMatchObject({ name: 'Other', total: 30 + 20 + 10 + 0 });
  });
});
