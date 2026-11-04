import type { Frequency } from '../schemas/recurring.ts';

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/**
 * Returns the next occurrence after `isoDate` (YYYY-MM-DD) for a frequency.
 * Monthly and yearly rules keep `anchorDay` (the original day of month) when the
 * target month is long enough, and clamp to the last day otherwise.
 */
export function nextOccurrence(isoDate: string, frequency: Frequency, anchorDay?: number): string {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number];

  if (frequency === 'daily' || frequency === 'weekly') {
    const date = new Date(Date.UTC(y, m - 1, d + (frequency === 'daily' ? 1 : 7)));
    return date.toISOString().slice(0, 10);
  }

  const monthIndex = frequency === 'monthly' ? m : m - 1 + 12;
  const year = y + Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  const day = Math.min(anchorDay ?? d, daysInMonth(year, month));
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}
