import { ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Money } from '@/components/ui/Money';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/features/categories/api';
import { useTransactions } from '@/features/transactions/api';
import { formatDate } from '@/lib/dates';

export function RecentTransactions() {
  const { data } = useTransactions({ page: 1, pageSize: 6 });
  const { data: categories = [] } = useCategories();
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <Link to="/transactions" className="text-sm font-medium text-brand-600 hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {!data ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState icon={ArrowLeftRight} title="No transactions yet" />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.items.map((t) => {
              const category = categoryById.get(t.categoryId);
              return (
                <li key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-slate-500">
                      {category?.name} · {formatDate(t.date)}
                    </p>
                  </div>
                  <Money amount={t.amount} type={t.type} className="text-sm font-medium" />
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
