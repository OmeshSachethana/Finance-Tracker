import { z } from 'zod';
import { hexColorSchema, idSchema } from './common';

export const transactionTypeSchema = z.enum(['income', 'expense']);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1, 'Name is required').max(40, 'Name is too long'),
  type: transactionTypeSchema,
  color: hexColorSchema,
  icon: z.string().min(1).max(40),
});
export type Category = z.infer<typeof categorySchema>;

export const createCategorySchema = categorySchema.omit({ id: true });
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
