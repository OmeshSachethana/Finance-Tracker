import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonth } from '@/lib/dates';
import { currentMonthKey, shiftMonth } from '@/lib/months';
import { Button } from './Button';

interface MonthPickerProps {
  value: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const isCurrent = value >= currentMonthKey();
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label="Previous month"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="min-w-24 text-center text-sm font-medium" aria-live="polite">
        {formatMonth(value)}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={isCurrent}
        onClick={() => onChange(shiftMonth(value, 1))}
        aria-label="Next month"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
