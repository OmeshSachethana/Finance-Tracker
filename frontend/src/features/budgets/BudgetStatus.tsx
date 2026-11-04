import type { BudgetStatus as Status } from '@finance-tracker/shared';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const config = {
  ok: { label: 'On track', tone: 'success', icon: CheckCircle2 },
  warning: { label: 'Close to limit', tone: 'warning', icon: AlertTriangle },
  exceeded: { label: 'Over budget', tone: 'danger', icon: XCircle },
} as const;

/** Status badge with an icon and text, so meaning never depends on colour alone. */
export function BudgetStatusBadge({ status }: { status: Status }) {
  const { label, tone, icon: Icon } = config[status];
  return (
    <Badge tone={tone} className="gap-1">
      <Icon className="size-3.5" aria-hidden />
      {label}
    </Badge>
  );
}
