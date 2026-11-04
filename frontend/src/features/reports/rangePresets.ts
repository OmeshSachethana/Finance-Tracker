import { toISODate, type DateRange } from '@finance-tracker/shared';

export type RangePreset = 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'last-year';

export const RANGE_PRESET_LABELS: Record<RangePreset, string> = {
  'this-month': 'This month',
  'last-month': 'Last month',
  'last-3-months': 'Last 3 months',
  'this-year': 'This year',
  'last-year': 'Last year',
};

/** Resolves a preset to a concrete date range relative to `today`. */
export function presetToRange(preset: RangePreset, today = new Date()): DateRange {
  const y = today.getFullYear();
  const m = today.getMonth();
  const range = (from: Date, to: Date) => ({ from: toISODate(from), to: toISODate(to) });

  switch (preset) {
    case 'this-month':
      return range(new Date(y, m, 1), new Date(y, m + 1, 0));
    case 'last-month':
      return range(new Date(y, m - 1, 1), new Date(y, m, 0));
    case 'last-3-months':
      return range(new Date(y, m - 2, 1), new Date(y, m + 1, 0));
    case 'this-year':
      return range(new Date(y, 0, 1), new Date(y, 11, 31));
    case 'last-year':
      return range(new Date(y - 1, 0, 1), new Date(y - 1, 11, 31));
  }
}
