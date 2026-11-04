import { CURRENCIES, type AccountType, type CreateAccountInput } from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SWATCHES } from '@/components/ui/swatches';
import { useMoney } from '@/hooks/useMoney';
import { formatAmountInput, parseAmountInput } from '@/lib/amount';
import { applyServerErrors } from '@/lib/formErrors';
import type { AccountWithBalance } from './api';
import { ACCOUNT_TYPE_LABELS } from './accountTypes';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50),
  type: z.enum(['cash', 'bank', 'credit_card', 'savings', 'wallet']),
  currency: z.enum(CURRENCIES),
  openingBalance: z.string().trim(),
  color: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

interface AccountFormProps {
  account?: AccountWithBalance;
  onSubmit: (input: CreateAccountInput) => Promise<unknown>;
  onCancel: () => void;
}

export function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const { currency: userCurrency } = useMoney();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: account?.name ?? '',
      type: account?.type ?? 'bank',
      currency: account?.currency ?? userCurrency,
      openingBalance: account ? formatAmountInput(account.openingBalance, account.currency) : '0',
      color: account?.color ?? SWATCHES[1],
    },
  });

  const submit = handleSubmit(async (values) => {
    const negative = values.openingBalance.startsWith('-');
    const parsed = parseAmountInput(
      values.openingBalance.replace(/^-/, '') || '0',
      values.currency,
    );
    if (parsed === null) {
      setError('openingBalance', { message: 'Enter an amount like 1500 or -250' });
      return;
    }
    setFormError(null);
    try {
      await onSubmit({ ...values, openingBalance: negative ? -parsed : parsed });
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <FormAlert message={formError} />
      <Field label="Account name" error={errors.name?.message}>
        <Input placeholder="e.g. Main bank account" {...register('name')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <Select {...register('type')}>
            {(Object.entries(ACCOUNT_TYPE_LABELS) as [AccountType, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </Select>
        </Field>
        <Field label="Currency">
          <Select {...register('currency')}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field
        label="Opening balance"
        hint="What the account held before you started tracking. Use a minus sign for debt."
        error={errors.openingBalance?.message}
      >
        <Input inputMode="decimal" {...register('openingBalance')} />
      </Field>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Colour</p>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <ColorPicker label="Account colour" value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {account ? 'Save changes' : 'Add account'}
        </Button>
      </div>
    </form>
  );
}
