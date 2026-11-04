import { z } from 'zod';
import { transactionTypeSchema } from './category';
import { amountSchema, idSchema, isoDateSchema } from './common';

export const transactionSchema = z.object({
  id: idSchema,
  type: transactionTypeSchema,
  amount: amountSchema,
  date: isoDateSchema,
  description: z.string().trim().min(1, 'Description is required').max(120),
  notes: z.string().trim().max(500).optional(),
  tags: z.array(z.string().trim().min(1).max(24)).max(10).default([]),
  categoryId: idSchema,
  accountId: idSchema,
});
export type Transaction = z.infer<typeof transactionSchema>;

export const createTransactionSchema = transactionSchema.omit({ id: true });
export type CreateTransactionInput = z.input<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.partial();
export type UpdateTransactionInput = z.input<typeof updateTransactionSchema>;
