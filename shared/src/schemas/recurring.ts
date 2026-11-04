import { z } from 'zod';
import { transactionTypeSchema } from './category.ts';
import { amountSchema, idSchema, isoDateSchema } from './common.ts';

export const frequencySchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);
export type Frequency = z.infer<typeof frequencySchema>;

export const recurringRuleSchema = z.object({
  id: idSchema,
  type: transactionTypeSchema,
  amount: amountSchema,
  description: z.string().trim().min(1, 'Description is required').max(120),
  categoryId: idSchema,
  accountId: idSchema,
  frequency: frequencySchema,
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  nextRunDate: isoDateSchema,
  active: z.boolean(),
});
export type RecurringRule = z.infer<typeof recurringRuleSchema>;

export const createRecurringRuleSchema = recurringRuleSchema
  .omit({ id: true, nextRunDate: true, active: true })
  .refine((r) => !r.endDate || r.endDate >= r.startDate, {
    message: 'End date must be after the start date',
    path: ['endDate'],
  });
export type CreateRecurringRuleInput = z.infer<typeof createRecurringRuleSchema>;

export const updateRecurringRuleSchema = recurringRuleSchema
  .pick({ amount: true, description: true, endDate: true, active: true })
  .partial();
export type UpdateRecurringRuleInput = z.infer<typeof updateRecurringRuleSchema>;
