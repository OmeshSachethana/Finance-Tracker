import { z } from 'zod';
import { createTransactionSchema } from './transaction.ts';
import { idSchema, isoDateSchema } from './common.ts';

export const frequencySchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);
export type Frequency = z.infer<typeof frequencySchema>;

export const recurringRuleSchema = z.object({
  id: idSchema,
  template: createTransactionSchema,
  frequency: frequencySchema,
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  nextRunDate: isoDateSchema,
  active: z.boolean(),
});
export type RecurringRule = z.infer<typeof recurringRuleSchema>;

export const createRecurringRuleSchema = recurringRuleSchema.omit({
  id: true,
  nextRunDate: true,
  active: true,
});
export type CreateRecurringRuleInput = z.input<typeof createRecurringRuleSchema>;
