import { CalendarClock, Pencil, PartyPopper, Plus, Trash2 } from 'lucide-react';
import { useId } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useMoney } from '@/hooks/useMoney';
import { formatDate } from '@/lib/dates';
import type { GoalWithProgress } from './api';

/** Whole days from today until an ISO date (negative if it has passed). */
export function daysUntil(isoDate: string, today = new Date()): number {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number];
  const target = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

interface GoalCardProps {
  goal: GoalWithProgress;
  onAddMoney: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, onAddMoney, onEdit, onDelete }: GoalCardProps) {
  const { format } = useMoney();
  const days = goal.deadline ? daysUntil(goal.deadline) : null;
  const titleId = useId();

  return (
    <Card role="article" aria-labelledby={titleId} className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 id={titleId} className="font-medium">
          {goal.name}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${goal.name}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${goal.name}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        <span className="text-xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
          {format(goal.savedAmount)}
        </span>{' '}
        of {format(goal.targetAmount)}
      </p>

      <div
        role="progressbar"
        aria-label={`${goal.name} progress`}
        aria-valuenow={goal.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${goal.percent}%`, backgroundColor: goal.color }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
        <span>{goal.percent}% saved</span>
        {goal.completed ? (
          <Badge tone="success" className="gap-1">
            <PartyPopper className="size-3.5" aria-hidden />
            Completed
          </Badge>
        ) : (
          days !== null && (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" aria-hidden />
              {days < 0
                ? `Was due ${formatDate(goal.deadline!)}`
                : days === 0
                  ? 'Due today'
                  : `${days} days left`}
            </span>
          )
        )}
      </div>

      {!goal.completed && (
        <Button variant="secondary" size="sm" className="mt-4 self-start" onClick={onAddMoney}>
          <Plus className="size-4" />
          Add money
        </Button>
      )}
    </Card>
  );
}
