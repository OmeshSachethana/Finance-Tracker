import type { Transaction } from '@finance-tracker/shared';
import { ArrowLeftRight, Download, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAccounts } from '@/features/accounts/api';
import { useCategories } from '@/features/categories/api';
import {
  useBulkDeleteTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from '@/features/transactions/api';
import { TransactionFilters } from '@/features/transactions/TransactionFilters';
import { TransactionForm } from '@/features/transactions/TransactionForm';
import { TransactionTable } from '@/features/transactions/TransactionTable';
import { useTransactionQuery } from '@/features/transactions/useTransactionQuery';
import { useHotkey } from '@/hooks/useHotkey';
import { downloadFile } from '@/lib/api/client';

type Editing = { mode: 'create' } | { mode: 'edit'; transaction: Transaction } | null;

export function TransactionsPage() {
  const toast = useToast();
  const { query, update, activeFilterCount } = useTransactionQuery();
  const { data, isLoading } = useTransactions(query);
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const bulkDelete = useBulkDeleteTransactions();

  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmBulk, setConfirmBulk] = useState(false);

  const transactions = data?.items ?? [];

  // Press N to add a transaction.
  useHotkey(
    'n',
    useCallback(() => setEditing({ mode: 'create' }), []),
  );

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((current) =>
      transactions.every((t) => current.has(t.id))
        ? new Set()
        : new Set(transactions.map((t) => t.id)),
    );

  const exportCsv = async () => {
    try {
      const { page: _page, pageSize: _size, sortBy: _sort, order: _order, ...filters } = query;
      await downloadFile('/transactions/export', 'transactions.csv', filters);
    } catch {
      toast('Could not export transactions', 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Every payment in and out, in one place."
        actions={
          <>
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button onClick={() => setEditing({ mode: 'create' })}>
              <Plus className="size-4" />
              Add transaction
              <kbd className="ml-1 hidden rounded border border-white/30 px-1 text-xs sm:inline">
                N
              </kbd>
            </Button>
          </>
        }
      />

      <Card>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <TransactionFilters />
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between bg-brand-50 px-4 py-2 text-sm dark:bg-brand-950">
            <span>{selected.size} selected</span>
            <Button variant="danger" size="sm" onClick={() => setConfirmBulk(true)}>
              <Trash2 className="size-4" />
              Delete selected
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title={activeFilterCount ? 'No matching transactions' : 'No transactions yet'}
            description={
              activeFilterCount
                ? 'Try changing or clearing your filters.'
                : 'Add your first income or expense to start tracking.'
            }
            action={
              !activeFilterCount && (
                <Button onClick={() => setEditing({ mode: 'create' })}>
                  <Plus className="size-4" />
                  Add transaction
                </Button>
              )
            }
          />
        ) : (
          <TransactionTable
            transactions={transactions}
            categories={categories}
            accounts={accounts}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onEdit={(transaction) => setEditing({ mode: 'edit', transaction })}
            onDelete={setDeleting}
          />
        )}

        {data && data.total > 0 && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              onPageChange={(page) => {
                setSelected(new Set());
                update({ page });
              }}
            />
          </div>
        )}
      </Card>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
      >
        {editing && (
          <TransactionForm
            transaction={editing.mode === 'edit' ? editing.transaction : undefined}
            onCancel={() => setEditing(null)}
            onSubmit={async (input) => {
              if (editing.mode === 'edit') {
                await updateTransaction.mutateAsync({ id: editing.transaction.id, ...input });
                toast('Transaction updated');
              } else {
                await createTransaction.mutateAsync(input);
                toast('Transaction added');
              }
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete transaction?"
        message={`"${deleting?.description}" will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={deleteTransaction.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          await deleteTransaction.mutateAsync(deleting.id);
          setSelected((current) => {
            const next = new Set(current);
            next.delete(deleting.id);
            return next;
          });
          setDeleting(null);
          toast('Transaction deleted');
        }}
      />

      <ConfirmDialog
        open={confirmBulk}
        title={`Delete ${selected.size} transactions?`}
        message="The selected transactions will be permanently removed."
        confirmLabel="Delete all"
        destructive
        loading={bulkDelete.isPending}
        onCancel={() => setConfirmBulk(false)}
        onConfirm={async () => {
          const { deleted } = await bulkDelete.mutateAsync([...selected]);
          setSelected(new Set());
          setConfirmBulk(false);
          toast(`${deleted} transactions deleted`);
        }}
      />
    </>
  );
}
