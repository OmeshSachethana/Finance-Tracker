import { Search, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAccounts } from '@/features/accounts/api';
import { useCategories } from '@/features/categories/api';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTransactionQuery } from './useTransactionQuery';

function FilterLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export function TransactionFilters() {
  const { query, update, reset, activeFilterCount } = useTransactionQuery();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const [search, setSearch] = useState(query.search ?? '');
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    if (debouncedSearch !== (query.search ?? '')) update({ search: debouncedSearch });
    // Only react to the debounced text, not to every query change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const clear = () => {
    setSearch('');
    reset();
  };

  const visibleCategories = categories.filter((c) => !query.type || c.type === query.type);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            type="search"
            aria-label="Search transactions"
            placeholder="Search description or notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clear}>
            <X className="size-4" />
            Clear filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <FilterLabel label="Type">
          <Select
            value={query.type ?? ''}
            onChange={(e) => update({ type: e.target.value, categoryId: undefined })}
          >
            <option value="">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </Select>
        </FilterLabel>
        <FilterLabel label="Category">
          <Select
            value={query.categoryId ?? ''}
            onChange={(e) => update({ categoryId: e.target.value })}
          >
            <option value="">All categories</option>
            {visibleCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FilterLabel>
        <FilterLabel label="Account">
          <Select
            value={query.accountId ?? ''}
            onChange={(e) => update({ accountId: e.target.value })}
          >
            <option value="">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </FilterLabel>
        <FilterLabel label="From">
          <Input
            type="date"
            value={query.from ?? ''}
            max={query.to}
            onChange={(e) => update({ from: e.target.value })}
          />
        </FilterLabel>
        <FilterLabel label="To">
          <Input
            type="date"
            value={query.to ?? ''}
            min={query.from}
            onChange={(e) => update({ to: e.target.value })}
          />
        </FilterLabel>
      </div>
    </div>
  );
}
