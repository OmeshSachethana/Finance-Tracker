import type { CategoryBreakdownItem } from '@finance-tracker/shared';
import { PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/features/categories/api';
import { useMoney } from '@/hooks/useMoney';
import { foldCategories } from './foldCategories';

interface SpendingByCategoryProps {
  items: CategoryBreakdownItem[] | undefined;
  title?: string;
  emptyTitle?: string;
  /** CSS colour for the bars; expense bars by default. */
  barColor?: string;
}

export function SpendingByCategory({
  items,
  title = 'Spending by category',
  emptyTitle = 'No spending this month',
  barColor = 'var(--chart-expense)',
}: SpendingByCategoryProps) {
  const { format } = useMoney();
  const { data: categories = [] } = useCategories();
  const names = new Map(categories.map((c) => [c.id, { name: c.name, color: c.color }]));

  const rows = items ? foldCategories(items, names) : [];
  const total = rows.reduce((sum, r) => sum + r.total, 0);
  const max = Math.max(...rows.map((r) => r.total), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!items ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-8" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon={PieChart} title={emptyTitle} />
        ) : (
          <ul className="space-y-4">
            {rows.map((row) => (
              <li key={row.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="truncate">{row.name}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    <span className="font-medium">{format(row.total)}</span>
                    <span className="ml-2 text-slate-500">
                      {Math.round((row.total / total) * 100)}%
                    </span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(row.total / max) * 100}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
