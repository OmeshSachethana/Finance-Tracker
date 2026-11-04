/** Formats YYYY-MM-DD as e.g. "4 Nov 2026" without timezone shifts. */
export function formatDate(isoDate: string, locale = 'en-GB'): string {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number];
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
}

/** Formats a month key (YYYY-MM) as e.g. "Nov 2026". */
export function formatMonth(monthKey: string, locale = 'en-GB'): string {
  const [y, m] = monthKey.split('-').map(Number) as [number, number];
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
    new Date(y, m - 1, 1),
  );
}

/** Whole days from today until an ISO date (negative if it has passed). */
export function daysUntil(isoDate: string, today = new Date()): number {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number];
  const target = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}
