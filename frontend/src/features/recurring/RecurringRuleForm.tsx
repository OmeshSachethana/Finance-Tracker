import { toISODate, type CreateRecurringRuleInput } from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAccounts } from '@/features/accounts/api';
import { useCategories } from '@/features/categories/api';
import { useMoney } from '@/hooks/useMoney';
import { parseAmountInput } from '@/lib/amount';
import { applyServerErrors } from '@/lib/formErrors';
import { FREQUENCY_LABELS } from './frequency';

const formSchema = z
  .object({
    type: z.enum(['income', 'expense']),
    amount: z.string().trim().min(1, 'Amount is required'),
    description: z.string().trim().min(1, 'Description is required').max(120),
    categoryId: z.string().min(1, 'Choose a category'),
    accountId: z.string().min(1, 'Choose an account'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    startDate: z.iso.date('Pick a start date'),
    endDate: z.string(),
  })
  .refine((v) => !v.endDate || v.endDate >= v.startDate, {
    message: 'End date must be after the start date',
    path: ['endDate'],
  });
type FormValues = z.infer<typeof formSchema>;

interface RecurringRuleFormProps {
  onSubmit: (input: CreateRecurringRuleInput) => Promise<unknown>;
  onCancel: () => void;
}

export function RecurringRuleForm({ onSubmit, onCancel }: RecurringRuleFormProps) {
  const { currency } = useMoney();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      description: '',
      categoryId: '',
      accountId: accounts.find((a) => !a.archived)?.id ?? '',
      frequency: 'monthly',
      startDate: toISODate(new Date()),
      endDate: '',
    },
  });
  const type = watch('type');

  const submit = handleSubmit(async (values) => {
    const amount = parseAmountInput(values.amount, currency);
    if (!amount) {
      setError('amount', { message: 'Enter a positive amount like 12.99' });
      return;
    }
    setFormError(null);
    try {
      await onSubmit({ ...values, amount, endDate: values.endDate || undefined });
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <FormAlert message={formError} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <Select {...register('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </Field>
        <Field label={`Amount (${currency})`} error={errors.amount?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register('amount')} />
        </Field>
      </div>
      <Field label="Description" error={errors.description?.message}>
        <Input placeholder="e.g. Netflix subscription" {...register('description')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" error={errors.categoryId?.message}>
          <Select {...register('categoryId')}>
            <option value="">Choose…</option>
            {categories
              .filter((c) => c.type === type)
              .map((c) => (
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
              .filter((a) => !a.archived)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Repeats">
          <Select {...register('frequency')}>
            {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Starts" error={errors.startDate?.message}>
          <Input type="date" {...register('startDate')} />
        </Field>
        <Field label="Ends (optional)" error={errors.endDate?.message}>
          <Input type="date" {...register('endDate')} />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Create rule
        </Button>
      </div>
    </form>
  );
}
