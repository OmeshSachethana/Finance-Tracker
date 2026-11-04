import { z } from 'zod';
import { amountSchema, idSchema } from './common.ts';

export const monthKeySchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be YYYY-MM');

export const budgetSchema = z.object({
  id: idSchema,
  categoryId: idSchema,
  month: monthKeySchema,
  limit: amountSchema,
  /** Percentage of the limit at which to warn. */
  alertThreshold: z.number().int().min(1).max(100).default(80),
});
export type Budget = z.infer<typeof budgetSchema>;

export const createBudgetSchema = budgetSchema.omit({ id: true });
export type CreateBudgetInput = z.input<typeof createBudgetSchema>;

export const updateBudgetSchema = budgetSchema
  .pick({ limit: true, alertThreshold: true })
  .partial();
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
