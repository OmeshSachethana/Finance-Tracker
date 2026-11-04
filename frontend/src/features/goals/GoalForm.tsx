import type { CreateGoalInput } from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { ColorPicker, SWATCHES } from '@/components/ui/ColorPicker';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { useMoney } from '@/hooks/useMoney';
import { formatAmountInput, parseAmountInput } from '@/lib/amount';
import { applyServerErrors } from '@/lib/formErrors';
import type { GoalWithProgress } from './api';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50),
  targetAmount: z.string().trim().min(1, 'Target is required'),
  deadline: z.string(),
  color: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

interface GoalFormProps {
  goal?: GoalWithProgress;
  onSubmit: (input: CreateGoalInput) => Promise<unknown>;
  onCancel: () => void;
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const { currency } = useMoney();
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
      name: goal?.name ?? '',
      targetAmount: goal ? formatAmountInput(goal.targetAmount, currency) : '',
      deadline: goal?.deadline ?? '',
      color: goal?.color ?? SWATCHES[0],
    },
  });

  const submit = handleSubmit(async (values) => {
    const targetAmount = parseAmountInput(values.targetAmount, currency);
    if (!targetAmount) {
      setError('targetAmount', { message: 'Enter a positive amount like 1000' });
      return;
    }
    setFormError(null);
    try {
      await onSubmit({
        name: values.name,
        targetAmount,
        color: values.color,
        deadline: values.deadline || undefined,
      });
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <FormAlert message={formError} />
      <Field label="Goal name" error={errors.name?.message}>
        <Input placeholder="e.g. Emergency fund" {...register('name')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Target (${currency})`} error={errors.targetAmount?.message}>
          <Input inputMode="decimal" placeholder="0.00" {...register('targetAmount')} />
        </Field>
        <Field label="Deadline (optional)" error={errors.deadline?.message}>
          <Input type="date" {...register('deadline')} />
        </Field>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Colour</p>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <ColorPicker label="Goal colour" value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {goal ? 'Save changes' : 'Create goal'}
        </Button>
      </div>
    </form>
  );
}
