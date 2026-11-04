import { formatMoney } from '@finance-tracker/shared';
import { Archive, ArchiveRestore, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { createElement, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { AccountForm } from '@/features/accounts/AccountForm';
import { ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS } from '@/features/accounts/accountTypes';
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
  type AccountWithBalance,
} from '@/features/accounts/api';
import { useMoney } from '@/hooks/useMoney';
import { ApiError } from '@/lib/api/ApiError';

type Editing = { mode: 'create' } | { mode: 'edit'; account: AccountWithBalance } | null;

export function AccountsPage() {
  const toast = useToast();
  const { format, currency } = useMoney();
  const { data: accounts, isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<AccountWithBalance | null>(null);

  // Net worth only adds up accounts in the user's own currency; others are listed separately.
  const sameCurrency = accounts?.filter((a) => !a.archived && a.currency === currency) ?? [];
  const netWorth = sameCurrency.reduce((sum, a) => sum + a.balance, 0);

  const toggleArchive = async (account: AccountWithBalance) => {
    await updateAccount.mutateAsync({ id: account.id, archived: !account.archived });
    toast(account.archived ? 'Account restored' : 'Account archived');
  };

  return (
    <>
      <PageHeader
        title="Accounts"
        description="Where your money lives."
        actions={
          <Button onClick={() => setEditing({ mode: 'create' })}>
            <Plus className="size-4" />
            Add account
          </Button>
        }
      />

      {accounts && accounts.length > 0 && (
        <Card className="mb-6 p-5">
          <p className="text-sm font-medium text-slate-500">Net worth ({currency})</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
            {format(netWorth)}
          </p>
        </Card>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : !accounts?.length ? (
        <Card>
          <EmptyState icon={Wallet} title="No accounts yet" />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id} className={account.archived ? 'p-5 opacity-60' : 'p-5'}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${account.color}1f`, color: account.color }}
                  >
                    {createElement(ACCOUNT_TYPE_ICONS[account.type], { className: 'size-5' })}
                  </span>
                  <div>
                    <h3 className="font-medium">{account.name}</h3>
                    <p className="text-xs text-slate-500">{ACCOUNT_TYPE_LABELS[account.type]}</p>
                  </div>
                </div>
                {account.archived && <Badge>Archived</Badge>}
              </div>
              <p className="mt-5 text-2xl font-semibold tracking-tight tabular-nums">
                {formatMoney(account.balance, account.currency)}
              </p>
              <div className="mt-4 flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditing({ mode: 'edit', account })}
                  aria-label={`Edit ${account.name}`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleArchive(account)}
                  aria-label={`${account.archived ? 'Restore' : 'Archive'} ${account.name}`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                >
                  {account.archived ? (
                    <ArchiveRestore className="size-4" />
                  ) : (
                    <Archive className="size-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(account)}
                  aria-label={`Delete ${account.name}`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.mode === 'edit' ? 'Edit account' : 'Add account'}
        className="max-w-md"
      >
        {editing && (
          <AccountForm
            account={editing.mode === 'edit' ? editing.account : undefined}
            onCancel={() => setEditing(null)}
            onSubmit={async (input) => {
              if (editing.mode === 'edit') {
                await updateAccount.mutateAsync({ id: editing.account.id, ...input });
                toast('Account updated');
              } else {
                await createAccount.mutateAsync(input);
                toast('Account added');
              }
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete account?"
        message="Only accounts without transactions can be deleted. Archive it instead to keep its history."
        confirmLabel="Delete"
        destructive
        loading={deleteAccount.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteAccount.mutateAsync(deleting.id);
            toast('Account deleted');
          } catch (error) {
            toast(error instanceof ApiError ? error.message : 'Could not delete account', 'error');
          }
          setDeleting(null);
        }}
      />
    </>
  );
}
