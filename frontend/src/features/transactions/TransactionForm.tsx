import {
  toISODate,
  type CreateTransactionInput,
  type Transaction,
  type TransactionType,
} from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useAccounts } from '@/features/accounts/api';
import { useDefaultAccount } from '@/features/accounts/useDefaultAccount';
import { useCategories } from '@/features/categories/api';
import { useMoney } from '@/hooks/useMoney';
import { formatAmountInput, parseAmountInput } from '@/lib/amount';
import { cn } from '@/lib/cn';
import { applyServerErrors } from '@/lib/formErrors';

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().trim().min(1, 'Amount is required'),
  date: z.iso.date('Pick a date'),
  description: z.string().trim().min(1, 'Description is required').max(120),
  categoryId: z.string().min(1, 'Choose a category'),
  accountId: z.string().min(1, 'Choose an account'),
  tags: z.string(),
  notes: z.string().max(500),
});
type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (input: CreateTransactionInput) => Promise<unknown>;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const { currency } = useMoney();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: transaction?.type ?? 'expense',
      amount: transaction ? formatAmountInput(transaction.amount, currency) : '',
      date: transaction?.date ?? toISODate(new Date()),
      description: transaction?.description ?? '',
      categoryId: transaction?.categoryId ?? '',
      accountId: transaction?.accountId ?? accounts.find((a) => !a.archived)?.id ?? '',
      tags: transaction?.tags.join(', ') ?? '',
      notes: transaction?.notes ?? '',
    },
  });
  useDefaultAccount('accountId', getValues, setValue);

  const type = useWatch({ control, name: 'type' });
  const typeCategories = categories.filter((c) => c.type === type);

  const chooseType = (next: TransactionType) => {
    setValue('type', next);
    setValue('categoryId', '');
  };

  const submit = handleSubmit(async (values) => {
    const amount = parseAmountInput(values.amount, currency);
    if (!amount) {
      setError('amount', { message: 'Enter a positive amount like 12.50' });
      return;
    }
    setFormError(null);
    try {
      await onSubmit({
        type: values.type,
        amount,
        date: values.date,
        description: values.description,
        categoryId: values.categoryId,
        accountId: values.accountId,
        tags: values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        notes: values.notes.trim() || undefined,
      });
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <FormAlert message={formError} />

      <div
        role="radiogroup"
        aria-label="Type"
        className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
      >
        {(['expense', 'income'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={type === option}
            onClick={() => chooseType(option)}
            className={cn(
              'rounded-md py-1.5 text-sm font-medium capitalize transition-colors',
              type === option
                ? 'bg-white shadow-sm dark:bg-slate-900'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Amount (${currency})`} error={errors.amount?.message}>
          <Input inputMode="decimal" placeholder="0.00" autoFocus {...register('amount')} />
        </Field>
        <Field label="Date" error={errors.date?.message}>
          <Input type="date" {...register('date')} />
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <Input placeholder="e.g. Weekly groceries" {...register('description')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" error={errors.categoryId?.message}>
          <Select {...register('categoryId')}>
            <option value="">Choose…</option>
            {typeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Account" error={errors.accountId?.message}>
          <Select {...register('accountId')}>
            <option value="">Choose…</option>
            {accounts
              .filter((a) => !a.archived || a.id === transaction?.accountId)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </Select>
        </Field>
      </div>

      <Field label="Tags" hint="Separate tags with commas" error={errors.tags?.message}>
        <Input placeholder="e.g. trip, work" {...register('tags')} />
      </Field>

      <Field label="Notes" error={errors.notes?.message}>
        <Textarea rows={2} {...register('notes')} />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {transaction ? 'Save changes' : 'Add transaction'}
        </Button>
      </div>
    </form>
  );
}
