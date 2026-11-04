import { cn } from '@/lib/cn';

const tones = {
  brand: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

interface ProgressBarProps {
  value: number;
  tone?: keyof typeof tones;
  label: string;
  className?: string;
}

export function ProgressBar({ value, tone = 'brand', label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
        className,
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all', tones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
