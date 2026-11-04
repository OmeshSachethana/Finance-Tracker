import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/features/auth/useAuth';
import { setAccessToken } from '@/lib/api/client';
import { useDeleteAccount } from './api';

export function DangerZone() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteAccount = useDeleteAccount();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setError(null);
    try {
      await deleteAccount.mutateAsync({ password });
      setAccessToken(null);
      queryClient.clear();
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete account');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="font-medium">Delete account</p>
        <p className="text-sm text-slate-500">
          Permanently remove your account and all transactions, budgets and goals.
        </p>
      </div>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete account
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete your account?"
        className="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={!password}
              loading={deleteAccount.isPending}
              onClick={confirm}
            >
              Delete forever
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This cannot be undone. Consider exporting your transactions as CSV first.
          </p>
          <FormAlert message={error} />
          <Field label="Confirm with your password">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
