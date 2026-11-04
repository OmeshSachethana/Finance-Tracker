import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SWATCHES } from './swatches';

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
