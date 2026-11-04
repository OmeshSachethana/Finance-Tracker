import type { Category } from '@finance-tracker/shared';

const isCatchAll = (name: string) => /^other\b/i.test(name);

/** Sorts categories by name, keeping catch-alls like "Other" at the end. */
export function sortCategories<T extends Pick<Category, 'name'>>(categories: T[]): T[] {
  return [...categories].sort(
    (a, b) =>
      Number(isCatchAll(a.name)) - Number(isCatchAll(b.name)) || a.name.localeCompare(b.name),
  );
}
