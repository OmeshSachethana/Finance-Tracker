import { PiggyBank } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBudgets } from '@/features/budgets/api';
import { BudgetStatusBadge } from '@/features/budgets/BudgetStatus';
import { statusBarTone } from '@/features/budgets/statusTone';
import { useCategories } from '@/features/categories/api';
import { useMoney } from '@/hooks/useMoney';

const MAX_ITEMS = 4;

/** The month's budgets closest to (or over) their limit. */
export function BudgetOverview({ month }: { month: string }) {
  const { format } = useMoney();
  const { data: budgets } = useBudgets(month);
  const { data: categories = [] } = useCategories();
  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const top = [...(budgets ?? [])].sort((a, b) => b.percent - a.percent).slice(0, MAX_ITEMS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgets this month</CardTitle>
        <Link
          to="/budgets"
          className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          Manage
        </Link>
      </CardHeader>
      <CardContent>
        {!budgets ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : top.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="No budgets set"
            description="Set monthly limits to see how you are tracking."
          />
        ) : (
          <ul className="space-y-5">
            {top.map((budget) => {
              const name = nameById.get(budget.categoryId) ?? 'Unknown';
              return (
                <li key={budget.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{name}</span>
                    <BudgetStatusBadge status={budget.status} />
                  </div>
                  <ProgressBar
                    value={budget.percent}
                    tone={statusBarTone[budget.status]}
                    label={`${name} budget used`}
                  />
                  <p className="mt-1 text-xs text-slate-500 tabular-nums">
                    {format(budget.spent)} of {format(budget.limit)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
