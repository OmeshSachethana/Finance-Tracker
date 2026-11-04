import type { RecurringRule } from '@finance-tracker/shared';
import { Pause, Play, Plus, Repeat, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Money } from '@/components/ui/Money';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/features/categories/api';
import {
  useCreateRecurringRule,
  useDeleteRecurringRule,
  useRecurringRules,
  useRunRecurringRules,
  useUpdateRecurringRule,
} from '@/features/recurring/api';
import { FREQUENCY_LABELS } from '@/features/recurring/frequency';
import { RecurringRuleForm } from '@/features/recurring/RecurringRuleForm';
import { formatDate } from '@/lib/dates';

export function RecurringPage() {
  const toast = useToast();
  const { data: rules, isLoading } = useRecurringRules();
  const { data: categories = [] } = useCategories();
  const createRule = useCreateRecurringRule();
  const updateRule = useUpdateRecurringRule();
  const deleteRule = useDeleteRecurringRule();
  const runRules = useRunRecurringRules();

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<RecurringRule | null>(null);
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const runNow = async () => {
    const { created } = await runRules.mutateAsync();
    toast(
      created ? `Created ${created} transactions` : 'Nothing is due right now',
      created ? 'success' : 'info',
    );
  };

  return (
    <>
      <PageHeader
        title="Recurring"
        description="Bills, subscriptions and income that repeat on a schedule."
        actions={
          <>
            <Button variant="secondary" onClick={runNow} loading={runRules.isPending}>
              <RefreshCw className="size-4" />
              Run due now
            </Button>
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              New rule
            </Button>
          </>
        }
      />

      <Card>
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : !rules?.length ? (
          <EmptyState
            icon={Repeat}
            title="No recurring rules"
            description="Add rent, salary or subscriptions once and they will be recorded automatically."
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="size-4" />
                New rule
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {rules.map((rule) => {
              const category = categoryById.get(rule.categoryId);
              return (
                <li key={rule.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-medium">
                      {rule.description}
                      {!rule.active && <Badge>Paused</Badge>}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {FREQUENCY_LABELS[rule.frequency]} · {category?.name ?? 'Unknown'} ·{' '}
                      {rule.active ? `Next on ${formatDate(rule.nextRunDate)}` : 'Not running'}
                      {rule.endDate && ` · Ends ${formatDate(rule.endDate)}`}
                    </p>
                  </div>
                  <Money amount={rule.amount} type={rule.type} className="font-medium" />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={async () => {
                        await updateRule.mutateAsync({ id: rule.id, active: !rule.active });
                        toast(rule.active ? 'Rule paused' : 'Rule resumed');
                      }}
                      aria-label={`${rule.active ? 'Pause' : 'Resume'} ${rule.description}`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                      {rule.active ? <Pause className="size-4" /> : <Play className="size-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(rule)}
                      aria-label={`Delete ${rule.description}`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Modal open={creating} onClose={() => setCreating(false)} title="New recurring rule">
        {creating && (
          <RecurringRuleForm
            onCancel={() => setCreating(false)}
            onSubmit={async (input) => {
              await createRule.mutateAsync(input);
              setCreating(false);
              toast('Recurring rule created');
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete recurring rule?"
        message="Future transactions will no longer be created. Past ones stay in your history."
        confirmLabel="Delete"
        destructive
        loading={deleteRule.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          await deleteRule.mutateAsync(deleting.id);
          setDeleting(null);
          toast('Recurring rule deleted');
        }}
      />
    </>
  );
}
