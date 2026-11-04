import { Plus, Target } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useContributeToGoal,
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useUpdateGoal,
  type GoalWithProgress,
} from '@/features/goals/api';
import { ContributionForm } from '@/features/goals/ContributionForm';
import { GoalCard } from '@/features/goals/GoalCard';
import { GoalForm } from '@/features/goals/GoalForm';

type Dialog =
  | { kind: 'create' }
  | { kind: 'edit'; goal: GoalWithProgress }
  | { kind: 'contribute'; goal: GoalWithProgress }
  | { kind: 'delete'; goal: GoalWithProgress }
  | null;

export function GoalsPage() {
  const toast = useToast();
  const { data: goals, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const contribute = useContributeToGoal();
  const [dialog, setDialog] = useState<Dialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <PageHeader
        title="Savings goals"
        description="Put money aside for the things that matter."
        actions={
          <Button onClick={() => setDialog({ kind: 'create' })}>
            <Plus className="size-4" />
            New goal
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : !goals?.length ? (
        <Card>
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Saving for a trip, a car or a rainy day? Create a goal to track it."
            action={
              <Button onClick={() => setDialog({ kind: 'create' })}>
                <Plus className="size-4" />
                New goal
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAddMoney={() => setDialog({ kind: 'contribute', goal })}
              onEdit={() => setDialog({ kind: 'edit', goal })}
              onDelete={() => setDialog({ kind: 'delete', goal })}
            />
          ))}
        </div>
      )}

      <Modal
        open={dialog?.kind === 'create' || dialog?.kind === 'edit'}
        onClose={close}
        title={dialog?.kind === 'edit' ? 'Edit goal' : 'New goal'}
        className="max-w-md"
      >
        {(dialog?.kind === 'create' || dialog?.kind === 'edit') && (
          <GoalForm
            goal={dialog.kind === 'edit' ? dialog.goal : undefined}
            onCancel={close}
            onSubmit={async (input) => {
              if (dialog.kind === 'edit') {
                await updateGoal.mutateAsync({ id: dialog.goal.id, ...input });
                toast('Goal updated');
              } else {
                await createGoal.mutateAsync(input);
                toast('Goal created');
              }
              close();
            }}
          />
        )}
      </Modal>

      <Modal
        open={dialog?.kind === 'contribute'}
        onClose={close}
        title={dialog?.kind === 'contribute' ? dialog.goal.name : ''}
        className="max-w-sm"
      >
        {dialog?.kind === 'contribute' && (
          <ContributionForm
            goal={dialog.goal}
            onCancel={close}
            onSubmit={async (amount) => {
              const updated = await contribute.mutateAsync({ id: dialog.goal.id, amount });
              toast(updated.completed ? `Goal reached: ${updated.name}!` : 'Goal updated');
              close();
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={dialog?.kind === 'delete'}
        title="Delete goal?"
        message="The goal and its saved total will be removed. Your transactions are not affected."
        confirmLabel="Delete"
        destructive
        loading={deleteGoal.isPending}
        onCancel={close}
        onConfirm={async () => {
          if (dialog?.kind !== 'delete') return;
          await deleteGoal.mutateAsync(dialog.goal.id);
          close();
          toast('Goal deleted');
        }}
      />
    </>
  );
}
