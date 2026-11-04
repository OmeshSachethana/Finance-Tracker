import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAccounts } from '@/features/accounts/api';
import { useCategories } from '@/features/categories/api';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTransactionQuery } from './useTransactionQuery';

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
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative min-w-56 flex-1">
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
      <Select
        aria-label="Type"
        value={query.type ?? ''}
        onChange={(e) => update({ type: e.target.value, categoryId: undefined })}
        className="w-auto"
      >
        <option value="">All types</option>
        <option value="expense">Expenses</option>
        <option value="income">Income</option>
      </Select>
      <Select
        aria-label="Category"
        value={query.categoryId ?? ''}
        onChange={(e) => update({ categoryId: e.target.value })}
        className="w-auto"
      >
        <option value="">All categories</option>
        {visibleCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Account"
        value={query.accountId ?? ''}
        onChange={(e) => update({ accountId: e.target.value })}
        className="w-auto"
      >
        <option value="">All accounts</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </Select>
      <Input
        type="date"
        aria-label="From date"
        value={query.from ?? ''}
        onChange={(e) => update({ from: e.target.value })}
        className="w-auto"
      />
      <Input
        type="date"
        aria-label="To date"
        value={query.to ?? ''}
        onChange={(e) => update({ to: e.target.value })}
        className="w-auto"
      />
      {activeFilterCount > 0 && (
        <Button variant="ghost" onClick={clear}>
          <X className="size-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
