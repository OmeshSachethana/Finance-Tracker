import type { MonthlyTrendItem } from '@finance-tracker/shared';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMoney } from '@/hooks/useMoney';
import { formatMonth } from '@/lib/dates';

const SERIES = [
  { key: 'income', label: 'Income', color: 'var(--chart-income)' },
  { key: 'expense', label: 'Expenses', color: 'var(--chart-expense)' },
] as const;

function Legend() {
  return (
    <ul className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
      {SERIES.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function ChartTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
  const { format } = useMoney();
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-1 font-medium">{formatMonth(String(label))}</p>
      {SERIES.map((s) => {
        const entry = payload.find((p) => p.dataKey === s.key);
        return (
          <p key={s.key} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span aria-hidden className="size-2 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.label}
            <span className="ml-auto pl-4 font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {format(Number(entry?.value ?? 0))}
            </span>
          </p>
        );
      })}
    </div>
  );
}

function TrendTable({ items }: { items: MonthlyTrendItem[] }) {
  const { format } = useMoney();
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs text-slate-500 uppercase">
        <tr>
          <th className="py-2 font-medium">Month</th>
          <th className="py-2 text-right font-medium">Income</th>
          <th className="py-2 text-right font-medium">Expenses</th>
          <th className="py-2 text-right font-medium">Net</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 tabular-nums dark:divide-slate-800">
        {items.map((m) => (
          <tr key={m.month}>
            <td className="py-2">{formatMonth(m.month)}</td>
            <td className="py-2 text-right">{format(m.income)}</td>
            <td className="py-2 text-right">{format(m.expense)}</td>
            <td className="py-2 text-right font-medium">{format(m.income - m.expense)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MonthlyTrendChart({ items }: { items: MonthlyTrendItem[] | undefined }) {
  const { formatCompact } = useMoney();
  const [showTable, setShowTable] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs expenses</CardTitle>
        <div className="flex items-center gap-4">
          <Legend />
          <Button variant="ghost" size="sm" onClick={() => setShowTable((v) => !v)}>
            {showTable ? 'Show chart' : 'Show table'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!items ? (
          <Skeleton className="h-64" />
        ) : showTable ? (
          <TrendTable items={items} />
        ) : (
          <div className="h-64" role="img" aria-label="Bar chart of monthly income and expenses">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items} barGap={2} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m: string) => formatMonth(m).split(' ')[0] ?? m}
                  tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--chart-grid)' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatCompact}
                  tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                />
                <Tooltip
                  content={(props) => (
                    <ChartTooltip {...(props as TooltipContentProps<number, string>)} />
                  )}
                  cursor={{ fill: 'var(--chart-grid)', opacity: 0.5 }}
                />
                {SERIES.map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={s.color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={24}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
