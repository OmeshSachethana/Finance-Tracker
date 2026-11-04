import { cn } from '@/lib/cn';
import { CATEGORY_ICONS } from './icons';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div role="radiogroup" aria-label="Icon" className="grid grid-cols-10 gap-1.5">
      {Object.entries(CATEGORY_ICONS).map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          role="radio"
          aria-checked={value === name}
          aria-label={name.replace(/-/g, ' ')}
          onClick={() => onChange(name)}
          className={cn(
            'flex aspect-square items-center justify-center rounded-md border text-slate-500 transition-colors',
            value === name
              ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
              : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
