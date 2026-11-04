import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export const SWATCHES = [
  '#6366f1',
  '#0ea5e9',
  '#14b8a6',
  '#22c55e',
  '#84cc16',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#64748b',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {SWATCHES.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={color}
          onClick={() => onChange(color)}
          className={cn(
            'flex size-8 items-center justify-center rounded-full ring-offset-2 transition dark:ring-offset-slate-900',
            value === color && 'ring-2 ring-slate-900 dark:ring-slate-100',
          )}
          style={{ backgroundColor: color }}
        >
          {value === color && <Check className="size-4 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );
}
