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
  categoryId: idSchema,
  accountId: idSchema,
});
export type Transaction = z.infer<typeof transactionSchema>;
