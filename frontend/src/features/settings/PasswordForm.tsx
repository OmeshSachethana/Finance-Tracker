import { passwordSchema } from '@finance-tracker/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/toast/useToast';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { applyServerErrors } from '@/lib/formErrors';
import { useChangePassword } from './api';

const formSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof formSchema>;

export function PasswordForm() {
  const toast = useToast();
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const submit = handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast('Password changed. Other devices have been signed out.');
    } catch (error) {
      const message = applyServerErrors(error, setError);
      if (message) setError('currentPassword', { message });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Current password" error={errors.currentPassword?.message}>
        <Input type="password" autoComplete="current-password" {...register('currentPassword')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="New password" error={errors.newPassword?.message}>
          <Input type="password" autoComplete="new-password" {...register('newPassword')} />
        </Field>
        <Field label="Confirm new password" error={errors.confirmPassword?.message}>
          <Input type="password" autoComplete="new-password" {...register('confirmPassword')} />
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          Change password
        </Button>
      </div>
    </form>
  );
}
