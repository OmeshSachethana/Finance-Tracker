import { Download, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { MonthlyTrendChart } from '@/features/dashboard/MonthlyTrendChart';
import { SpendingByCategory } from '@/features/dashboard/SpendingByCategory';
import { StatTile } from '@/features/dashboard/StatTile';
import {
  presetToRange,
  RANGE_PRESET_LABELS,
  type RangePreset,
} from '@/features/reports/rangePresets';
import { useCategoryBreakdown, useMonthlyTrend, useSummary } from '@/features/stats/api';
import { useMoney } from '@/hooks/useMoney';
import { downloadFile } from '@/lib/api/client';
import { formatDate } from '@/lib/dates';

export function ReportsPage() {
  const toast = useToast();
  const { format } = useMoney();
  const [preset, setPreset] = useState<RangePreset>('last-3-months');
  const range = presetToRange(preset);

  const { data: summary } = useSummary(range);
  const { data: spending } = useCategoryBreakdown(range, 'expense');
  const { data: income } = useCategoryBreakdown(range, 'income');
  const { data: trend } = useMonthlyTrend(12);

  const exportCsv = async () => {
    try {
      await downloadFile('/transactions/export', `transactions-${range.from}-to-${range.to}.csv`, {
        ...range,
      });
    } catch {
      toast('Could not export transactions', 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description={`${formatDate(range.from)} – ${formatDate(range.to)}`}
        actions={
          <>
            <Select
              aria-label="Period"
              value={preset}
              onChange={(e) => setPreset(e.target.value as RangePreset)}
              className="w-auto"
            >
              {Object.entries(RANGE_PRESET_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="size-4" />
              Export period
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Income" icon={TrendingUp} value={summary && format(summary.income)} />
        <StatTile label="Expenses" icon={TrendingDown} value={summary && format(summary.expense)} />
        <StatTile label="Net" icon={Wallet} value={summary && format(summary.balance)} />
        <StatTile
          label="Savings rate"
          icon={PiggyBank}
          value={summary && `${summary.savingsRate}%`}
        />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <SpendingByCategory items={spending} emptyTitle="No spending in this period" />
        <SpendingByCategory
          items={income}
          title="Income by category"
          emptyTitle="No income in this period"
          barColor="var(--chart-income)"
        />
      </div>

      <div className="mt-6">
        <MonthlyTrendChart items={trend} />
      </div>
    </>
  );
}
