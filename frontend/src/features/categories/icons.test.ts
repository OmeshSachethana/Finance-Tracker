import { DEFAULT_CATEGORIES } from '@finance-tracker/shared';
import { CircleEllipsis } from 'lucide-react';
import { CATEGORY_ICONS, categoryIcon } from './icons';

describe('category icons', () => {
  it('has an icon for every default category', () => {
    for (const category of DEFAULT_CATEGORIES) {
      expect(CATEGORY_ICONS[category.icon]).toBeDefined();
    }
  });

  it('falls back for unknown names', () => {
    expect(categoryIcon('nope')).toBe(CircleEllipsis);
  });
});
