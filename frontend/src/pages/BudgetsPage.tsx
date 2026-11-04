import { Copy, PiggyBank, Plus } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useBudgets,
  useCopyBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
  type BudgetWithProgress,
} from '@/features/budgets/api';
import { BudgetCard } from '@/features/budgets/BudgetCard';
import { BudgetForm } from '@/features/budgets/BudgetForm';
import { useCategories } from '@/features/categories/api';
import { useMoney } from '@/hooks/useMoney';
import { currentMonthKey } from '@/lib/months';

type Editing = { mode: 'create' } | { mode: 'edit'; budget: BudgetWithProgress } | null;

export function BudgetsPage() {
  const toast = useToast();
  const { format } = useMoney();
  const [month, setMonth] = useState(currentMonthKey);
  const { data: budgets, isLoading } = useBudgets(month);
  const { data: categories = [] } = useCategories();

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  const copyBudgets = useCopyBudgets();

  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<BudgetWithProgress | null>(null);

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const budgeted = new Set(budgets?.map((b) => b.categoryId));
  const available = categories.filter((c) => c.type === 'expense' && !budgeted.has(c.id));

  const totalLimit = budgets?.reduce((sum, b) => sum + b.limit, 0) ?? 0;
  const totalSpent = budgets?.reduce((sum, b) => sum + b.spent, 0) ?? 0;

  const copyPrevious = async () => {
    const { copied } = await copyBudgets.mutateAsync(month);
    toast(copied ? `Copied ${copied} budgets from last month` : 'No new budgets to copy', 'info');
  };

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set monthly limits and see how close you are."
        actions={
          <>
            <MonthPicker value={month} onChange={setMonth} />
            <Button variant="secondary" onClick={copyPrevious} loading={copyBudgets.isPending}>
              <Copy className="size-4" />
              Copy last month
            </Button>
            <Button
              onClick={() => setEditing({ mode: 'create' })}
              disabled={available.length === 0}
            >
              <Plus className="size-4" />
              Add budget
            </Button>
          </>
        }
      />

      {budgets && budgets.length > 0 && (
        <p className="mb-4 text-sm text-slate-500">
          {format(totalSpent)} spent of {format(totalLimit)} budgeted this month
        </p>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : !budgets?.length ? (
        <Card>
          <EmptyState
            icon={PiggyBank}
            title="No budgets for this month"
            description="Add a limit for a category, or copy last month's budgets."
            action={
              <Button onClick={() => setEditing({ mode: 'create' })}>
                <Plus className="size-4" />
                Add budget
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              category={categoryById.get(budget.categoryId)}
              onEdit={() => setEditing({ mode: 'edit', budget })}
              onDelete={() => setDeleting(budget)}
            />
          ))}
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === 'edit' ? 'Edit budget' : 'Add budget'}
        className="max-w-md"
      >
        {editing && (
          <BudgetForm
            budget={editing.mode === 'edit' ? editing.budget : undefined}
            categories={
              editing.mode === 'edit'
                ? categories.filter((c) => c.id === editing.budget.categoryId)
                : available
            }
            onCancel={() => setEditing(null)}
            onSubmit={async ({ categoryId, limit, alertThreshold }) => {
              if (editing.mode === 'edit') {
                await updateBudget.mutateAsync({ id: editing.budget.id, limit, alertThreshold });
                toast('Budget updated');
              } else {
                await createBudget.mutateAsync({ categoryId, limit, alertThreshold, month });
                toast('Budget added');
              }
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete budget?"
        message="Your transactions stay as they are; only the limit is removed."
        confirmLabel="Delete"
        destructive
        loading={deleteBudget.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          await deleteBudget.mutateAsync(deleting.id);
          setDeleting(null);
          toast('Budget deleted');
        }}
      />
    </>
  );
}
