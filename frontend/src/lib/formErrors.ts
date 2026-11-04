import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from './api/ApiError';

/**
 * Copies server-side field errors onto the form. Returns a general message
 * to show when the error is not tied to a specific field.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string | null {
  if (error instanceof ApiError) {
    if (error.details) {
      for (const [field, messages] of Object.entries(error.details)) {
        if (messages?.[0]) setError(field as Path<T>, { message: messages[0] });
      }
      return null;
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
