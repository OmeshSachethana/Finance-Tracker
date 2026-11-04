import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { FormAlert } from '@/components/ui/FormAlert';
import { Input } from '@/components/ui/Input';
import { useMoney } from '@/hooks/useMoney';
import { parseAmountInput } from '@/lib/amount';
import { applyServerErrors } from '@/lib/formErrors';
import type { GoalWithProgress } from './api';

interface ContributionFormProps {
  goal: GoalWithProgress;
  onSubmit: (amount: number) => Promise<unknown>;
  onCancel: () => void;
}

/** Adds money to a goal, or takes it out when "Withdraw" is chosen. */
export function ContributionForm({ goal, onSubmit, onCancel }: ContributionFormProps) {
  const { currency, format } = useMoney();
  const [value, setValue] = useState('');
  const [withdraw, setWithdraw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const amount = parseAmountInput(value, currency);
    if (!amount) {
      setError('Enter a positive amount like 50');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(withdraw ? -amount : amount);
    } catch (err) {
      setError(applyServerErrors(err, () => {}) ?? 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <p className="text-sm text-slate-500">
        {format(goal.savedAmount)} saved of {format(goal.targetAmount)}
      </p>
      <FormAlert message={error} />
      <Field label={`Amount (${currency})`}>
        <Input
          inputMode="decimal"
          placeholder="0.00"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={withdraw}
          onChange={(e) => setWithdraw(e.target.checked)}
          className="size-4 accent-brand-600"
        />
        Withdraw instead
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {withdraw ? 'Withdraw' : 'Add money'}
        </Button>
      </div>
    </form>
  );
}
