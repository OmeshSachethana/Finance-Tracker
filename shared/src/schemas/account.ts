import { z } from 'zod';
import { currencySchema, hexColorSchema, idSchema } from './common';

export const accountTypeSchema = z.enum(['cash', 'bank', 'credit_card', 'savings', 'wallet']);
export type AccountType = z.infer<typeof accountTypeSchema>;

export const accountSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name is too long'),
  type: accountTypeSchema,
  currency: currencySchema,
  openingBalance: z.number().int(),
  color: hexColorSchema,
  archived: z.boolean(),
});
export type Account = z.infer<typeof accountSchema>;

export const createAccountSchema = accountSchema.omit({ id: true, archived: true });
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const updateAccountSchema = accountSchema.omit({ id: true }).partial();
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
