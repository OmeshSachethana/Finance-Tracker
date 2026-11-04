import type { Category } from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useMoney } from '@/hooks/useMoney';
import { formatAmountInput, parseAmountInput } from '@/lib/amount';
import { applyServerErrors } from '@/lib/formErrors';
import type { BudgetWithProgress } from './api';

const formSchema = z.object({
  categoryId: z.string().min(1, 'Choose a category'),
  limit: z.string().trim().min(1, 'Limit is required'),
  alertThreshold: z.coerce.number().int().min(1, 'Use 1–100').max(100, 'Use 1–100'),
});
type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

export interface BudgetFormValues {
  categoryId: string;
  limit: number;
  alertThreshold: number;
}

interface BudgetFormProps {
  budget?: BudgetWithProgress;
  /** Expense categories that can still get a budget this month. */
  categories: Category[];
  onSubmit: (values: BudgetFormValues) => Promise<unknown>;
  onCancel: () => void;
}

export function BudgetForm({ budget, categories, onSubmit, onCancel }: BudgetFormProps) {
  const { currency } = useMoney();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: budget?.categoryId ?? '',
      limit: budget ? formatAmountInput(budget.limit, currency) : '',
      alertThreshold: budget?.alertThreshold ?? 80,
    },
  });

  const submit = handleSubmit(async (values) => {
    const limit = parseAmountInput(values.limit, currency);
    if (!limit) {
      setError('limit', { message: 'Enter a positive amount like 250' });
      return;
    }
    setFormError(null);
    try {
      await onSubmit({ ...values, limit });
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <FormAlert message={formError} />
      <Field label="Category" error={errors.categoryId?.message}>
        <Select disabled={Boolean(budget)} {...register('categoryId')}>
          <option value="">Choose…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={`Monthly limit (${currency})`} error={errors.limit?.message}>
        <Input inputMode="decimal" placeholder="0.00" {...register('limit')} />
      </Field>
      <Field
        label="Warn me at (% of limit)"
        hint="You will see a warning once spending reaches this share of the limit."
        error={errors.alertThreshold?.message}
      >
        <Input type="number" min={1} max={100} {...register('alertThreshold')} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {budget ? 'Save changes' : 'Add budget'}
        </Button>
      </div>
    </form>
  );
}
