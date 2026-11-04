import type { CategoryBreakdownItem } from '@finance-tracker/shared';

const MAX_ROWS = 6;

export interface CategoryRow {
  id: string;
  name: string;
  color: string;
  total: number;
}

/** Shows the largest categories and folds the rest into "Other". */
export function foldCategories(
  items: CategoryBreakdownItem[],
  names: Map<string, { name: string; color: string }>,
): CategoryRow[] {
  const rows = items.map((item) => ({
    id: item.categoryId,
    name: names.get(item.categoryId)?.name ?? 'Unknown',
    color: names.get(item.categoryId)?.color ?? '#94a3b8',
    total: item.total,
  }));
  if (rows.length <= MAX_ROWS) return rows;
  const rest = rows.slice(MAX_ROWS - 1).reduce((sum, r) => sum + r.total, 0);
  return [
    ...rows.slice(0, MAX_ROWS - 1),
    { id: 'other', name: 'Other', color: '#94a3b8', total: rest },
  ];
}
