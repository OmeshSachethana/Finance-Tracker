import { useEffect } from 'react';
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { useAccounts } from './api';

/**
 * Fills an empty account field with the first active account once accounts
 * have loaded, so forms opened before the accounts query finishes still get a default.
 */
export function useDefaultAccount<T extends FieldValues>(
  field: Path<T>,
  getValues: UseFormGetValues<T>,
  setValue: UseFormSetValue<T>,
) {
  const { data: accounts } = useAccounts();
  useEffect(() => {
    const first = accounts?.find((a) => !a.archived);
    if (first && !getValues(field)) setValue(field, first.id as PathValue<T, Path<T>>);
  }, [accounts, field, getValues, setValue]);
}
