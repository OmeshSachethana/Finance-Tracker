import { useMoney } from '@/hooks/useMoney';
import { cn } from '@/lib/cn';

interface MoneyProps {
  amount: number;
  /** Colour income green and expenses red, with a +/- sign. */
  type?: 'income' | 'expense';
  className?: string;
}

export function Money({ amount, type, className }: MoneyProps) {
  const { format } = useMoney();
  const sign = type === 'income' ? '+' : type === 'expense' ? '−' : '';
  return (
    <span
      className={cn(
        'tabular-nums',
        type === 'income' && 'text-emerald-600 dark:text-emerald-400',
        type === 'expense' && 'text-slate-900 dark:text-slate-100',
        className,
      )}
    >
      {sign}
      {format(amount)}
    </span>
  );
}
