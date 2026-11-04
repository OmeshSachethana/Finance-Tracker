/** Returns a date as YYYY-MM-DD using its local calendar day. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns the month key (YYYY-MM) for a date, used to group by month. */
export function toMonthKey(date: Date): string {
  return toISODate(date).slice(0, 7);
}
