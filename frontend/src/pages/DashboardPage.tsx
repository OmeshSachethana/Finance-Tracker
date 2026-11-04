import { PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { useAuth } from '@/features/auth/useAuth';
import { MonthlyTrendChart } from '@/features/dashboard/MonthlyTrendChart';
import { RecentTransactions } from '@/features/dashboard/RecentTransactions';
import { SpendingByCategory } from '@/features/dashboard/SpendingByCategory';
import { StatTile } from '@/features/dashboard/StatTile';
import { useCategoryBreakdown, useMonthlyTrend, useSummary } from '@/features/stats/api';
import { useMoney } from '@/hooks/useMoney';
import { comparisonRange, currentMonthKey, monthToRange } from '@/lib/months';
import { percentChange } from '@/lib/percentChange';

export function DashboardPage() {
  const { user } = useAuth();
  const { format } = useMoney();
  const [month, setMonth] = useState(currentMonthKey);
  const range = monthToRange(month);

  const { data: summary } = useSummary(range);
  const { data: previous } = useSummary(comparisonRange(month));
  const { data: byCategory } = useCategoryBreakdown(range);
  const { data: trend } = useMonthlyTrend(6);

  const firstName = user?.name.split(' ')[0];

  return (
    <>
      <PageHeader
        title={`Hello, ${firstName}`}
        description="Here is how your money moved this month."
        actions={<MonthPicker value={month} onChange={setMonth} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Income"
          icon={TrendingUp}
          value={summary && format(summary.income)}
          change={summary && percentChange(summary.income, previous?.income)}
        />
        <StatTile
          label="Expenses"
          icon={TrendingDown}
          higherIsBetter={false}
          value={summary && format(summary.expense)}
          change={summary && percentChange(summary.expense, previous?.expense)}
        />
        <StatTile label="Net balance" icon={Wallet} value={summary && format(summary.balance)} />
        <StatTile
          label="Savings rate"
          icon={PiggyBank}
          value={summary && `${summary.savingsRate}%`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MonthlyTrendChart items={trend} />
        </div>
        <div className="lg:col-span-2">
          <SpendingByCategory items={byCategory} />
        </div>
      </div>

      <div className="mt-6">
        <RecentTransactions />
      </div>
    </>
  );
}
