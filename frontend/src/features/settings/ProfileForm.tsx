import { CURRENCIES, updateProfileSchema, type UpdateProfileInput } from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/toast/useToast';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/features/auth/useAuth';
import { applyServerErrors } from '@/lib/formErrors';
import { useUpdateProfile } from './api';

export function ProfileForm() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name, currency: user?.currency },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const updated = await updateProfile.mutateAsync(values);
      setUser(updated);
      reset({ name: updated.name, currency: updated.currency });
      // Amounts are shown in the user's currency, so redraw everything.
      await queryClient.invalidateQueries();
      toast('Profile saved');
    } catch (error) {
      const message = applyServerErrors(error, setError);
      if (message) toast(message, 'error');
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <Input autoComplete="name" {...register('name')} />
        </Field>
        <Field label="Email" hint="Email cannot be changed">
          <Input value={user?.email ?? ''} disabled readOnly />
        </Field>
      </div>
      <Field
        label="Display currency"
        hint="Used to format amounts across the app."
        error={errors.currency?.message}
      >
        <Select {...register('currency')}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save profile
        </Button>
      </div>
    </form>
  );
}
