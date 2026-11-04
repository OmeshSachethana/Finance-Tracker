/** Percentage change from `previous` to `current`, or null when there is no baseline. */
export function percentChange(current: number, previous: number | undefined): number | null {
  if (previous === undefined || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}
