/** Returns the last `count` month keys (YYYY-MM) ending with the month of `end`, oldest first. */
export function lastMonthKeys(count: number, end: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return keys;
}

/** Returns the month key before the given one, e.g. 2026-01 -> 2025-12. */
export function previousMonthKey(month: string): string {
  const [year, m] = month.split('-').map(Number) as [number, number];
  const d = new Date(year, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
