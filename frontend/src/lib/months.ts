import { getMonthRange, toISODate, toMonthKey, type DateRange } from '@finance-tracker/shared';

/** Date range (first to last day) for a month key like 2026-11. */
export function monthToRange(monthKey: string): DateRange {
  const [y, m] = monthKey.split('-').map(Number) as [number, number];
  const { start, end } = getMonthRange(new Date(y, m - 1, 1));
  return { from: toISODate(start), to: toISODate(end) };
}

/** Shifts a month key by `delta` months. */
export function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split('-').map(Number) as [number, number];
  return toMonthKey(new Date(y, m - 1 + delta, 1));
}

export function currentMonthKey(): string {
  return toMonthKey(new Date());
}
