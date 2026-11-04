import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

interface StatTileProps {
  label: string;
  value: string | undefined;
  icon: LucideIcon;
  /** Percentage change vs the previous period. */
  change?: number | null;
  /** Whether a rise is good (income) or bad (expenses). */
  higherIsBetter?: boolean;
}

export function StatTile({
  label,
  value,
  icon: Icon,
  change,
  higherIsBetter = true,
}: StatTileProps) {
  const hasChange = change !== undefined && change !== null && Number.isFinite(change);
  const good = hasChange && change >= 0 === higherIsBetter;
  const Arrow = hasChange && change >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className="size-5 text-slate-400" aria-hidden />
      </div>
      {value === undefined ? (
        <Skeleton className="mt-3 h-8 w-32" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      )}
      {hasChange && (
        <p
          className={cn(
            'mt-1 inline-flex items-center gap-0.5 text-xs font-medium',
            good ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
          )}
        >
          <Arrow className="size-3.5" aria-hidden />
          {Math.abs(change).toFixed(0)}% vs last month
        </p>
      )}
    </Card>
  );
}
