import type { Category, Transaction } from '@finance-tracker/shared';
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Money } from '@/components/ui/Money';
import type { AccountWithBalance } from '@/features/accounts/api';
import { formatDate } from '@/lib/dates';
import { useTransactionQuery } from './useTransactionQuery';

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: AccountWithBalance[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

type SortField = 'date' | 'description' | 'amount';

function SortHeader({ field, label, align }: { field: SortField; label: string; align?: 'right' }) {
  const { query, update } = useTransactionQuery();
  const sortBy = query.sortBy ?? 'date';
  const order = query.order ?? 'desc';
  const active = sortBy === field;
  const Icon = order === 'asc' ? ArrowUp : ArrowDown;

  return (
    <th
      scope="col"
      aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={align === 'right' ? 'px-4 py-3 text-right' : 'px-4 py-3 text-left'}
    >
      <button
        type="button"
        onClick={() =>
          update({
            sortBy: field,
            order: active && order === 'desc' ? 'asc' : 'desc',
            page: undefined,
          })
        }
        className="inline-flex items-center gap-1 font-medium uppercase hover:text-slate-900 dark:hover:text-slate-100"
      >
        {label}
        {active && <Icon className="size-3.5" aria-hidden />}
      </button>
    </th>
  );
}

export function TransactionTable({
  transactions,
  categories,
  accounts,
  selected,
  onToggle,
  onToggleAll,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const accountById = new Map(accounts.map((a) => [a.id, a]));
  const allSelected = transactions.length > 0 && transactions.every((t) => selected.has(t.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 text-xs text-slate-500 uppercase dark:border-slate-800">
          <tr>
            <th scope="col" className="w-10 px-4 py-3">
              <input
                type="checkbox"
                aria-label="Select all on this page"
                checked={allSelected}
                onChange={onToggleAll}
                className="size-4 rounded border-slate-300 accent-brand-600"
              />
            </th>
            <SortHeader field="date" label="Date" />
            <SortHeader field="description" label="Description" />
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Category
            </th>
            <th scope="col" className="hidden px-4 py-3 text-left font-medium md:table-cell">
              Account
            </th>
            <SortHeader field="amount" label="Amount" align="right" />
            <th scope="col" className="w-20 px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((t) => {
            const category = categoryById.get(t.categoryId);
            return (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${t.description}`}
                    checked={selected.has(t.id)}
                    onChange={() => onToggle(t.id)}
                    className="size-4 rounded border-slate-300 accent-brand-600"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(t.date)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{t.description}</p>
                  {t.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {t.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: category?.color }}
                    />
                    {category?.name ?? 'Unknown'}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                  {accountById.get(t.accountId)?.name}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  <Money amount={t.amount} type={t.type} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(t)}
                      aria-label={`Edit ${t.description}`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(t)}
                      aria-label={`Delete ${t.description}`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
