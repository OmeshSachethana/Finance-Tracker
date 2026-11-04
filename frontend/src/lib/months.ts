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

/**
 * The range to compare `range` against: the previous month, cut to the same
 * number of days when `range` is the current, still unfinished month.
 */
export function comparisonRange(monthKey: string, today = new Date()): DateRange {
  const previous = monthToRange(shiftMonth(monthKey, -1));
  if (monthKey !== toMonthKey(today)) return previous;
  const lastDay = Number(previous.to.slice(8));
  const day = Math.min(today.getDate(), lastDay);
  return { from: previous.from, to: `${previous.to.slice(0, 8)}${String(day).padStart(2, '0')}` };
}
