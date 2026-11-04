import type { Category } from '@finance-tracker/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { ApiError } from '@/lib/api/ApiError';

interface DeleteCategoryDialogProps {
  category: Category | null;
  categories: Category[];
  onDelete: (args: { id: string; reassignTo?: string }) => Promise<unknown>;
  onClose: () => void;
}

/**
 * Deletes a category. If it still has transactions, asks where to move them
 * instead of failing.
 */
export function DeleteCategoryDialog({
  category,
  categories,
  onDelete,
  onClose,
}: DeleteCategoryDialogProps) {
  const [needsReassign, setNeedsReassign] = useState(false);
  const [target, setTarget] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const others = categories.filter((c) => c.type === category?.type && c.id !== category?.id);

  const close = () => {
    setNeedsReassign(false);
    setTarget('');
    setError(null);
    onClose();
  };

  const confirm = async () => {
    if (!category) return;
    setBusy(true);
    setError(null);
    try {
      await onDelete({ id: category.id, reassignTo: needsReassign ? target : undefined });
      close();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && !needsReassign) {
        setNeedsReassign(true);
      } else {
        setError(err instanceof Error ? err.message : 'Could not delete category');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={category !== null}
      onClose={close}
      title={`Delete ${category?.name ?? 'category'}?`}
      className="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={busy}
            disabled={needsReassign && !target}
            onClick={confirm}
          >
            {needsReassign ? 'Move and delete' : 'Delete'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormAlert message={error} />
        {needsReassign ? (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This category has transactions. Choose where to move them before deleting it. Budgets
              for this category will be removed.
            </p>
            <Field label="Move transactions to">
              <Select value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="">Choose…</option>
                {others.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This category will be permanently removed.
          </p>
        )}
      </div>
    </Modal>
  );
}
