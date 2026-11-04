import {
  createCategorySchema,
  type Category,
  type CreateCategoryInput,
} from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SWATCHES } from '@/components/ui/swatches';
import { applyServerErrors } from '@/lib/formErrors';
import { IconPicker } from './IconPicker';

interface CategoryFormProps {
  category?: Category;
  defaultType?: Category['type'];
  onSubmit: (input: CreateCategoryInput) => Promise<unknown>;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  defaultType = 'expense',
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
      type: category?.type ?? defaultType,
      color: category?.color ?? SWATCHES[0],
      icon: category?.icon ?? 'circle-ellipsis',
    },
  });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <FormAlert message={formError} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <Input placeholder="e.g. Pets" {...register('name')} />
        </Field>
        <Field label="Type" hint={category ? 'Type cannot change once created' : undefined}>
          <Select disabled={Boolean(category)} {...register('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </Field>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Colour</p>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <ColorPicker label="Category colour" value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Icon</p>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => <IconPicker value={field.value} onChange={field.onChange} />}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {category ? 'Save changes' : 'Add category'}
        </Button>
      </div>
    </form>
  );
}
