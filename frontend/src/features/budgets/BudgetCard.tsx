import type { Category } from '@finance-tracker/shared';
import { Pencil, Trash2 } from 'lucide-react';
import { useId } from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useMoney } from '@/hooks/useMoney';
import type { BudgetWithProgress } from './api';
import { BudgetStatusBadge } from './BudgetStatus';
import { statusBarTone } from './statusTone';

interface BudgetCardProps {
  budget: BudgetWithProgress;
  category: Category | undefined;
  onEdit: () => void;
  onDelete: () => void;
}

export function BudgetCard({ budget, category, onEdit, onDelete }: BudgetCardProps) {
  const { format } = useMoney();
  const name = category?.name ?? 'Unknown category';
  const titleId = useId();
  return (
    <Card role="article" aria-labelledby={titleId} className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-3 rounded-full"
            style={{ backgroundColor: category?.color }}
          />
          <h3 id={titleId} className="font-medium">
            {name}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${name} budget`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${name} budget`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        <span className="text-xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
          {format(budget.spent)}
        </span>{' '}
        of {format(budget.limit)}
      </p>

      <ProgressBar
        className="mt-3"
        value={budget.percent}
        tone={statusBarTone[budget.status]}
        label={`${name} budget used`}
      />

      <div className="mt-3 flex items-center justify-between text-sm">
        <BudgetStatusBadge status={budget.status} />
        <span className="text-slate-500 tabular-nums">
          {budget.remaining >= 0
            ? `${format(budget.remaining)} left`
            : `${format(-budget.remaining)} over`}
        </span>
      </div>
    </Card>
  );
}
