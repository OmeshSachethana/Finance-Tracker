import { z } from 'zod';
import { amountSchema, hexColorSchema, idSchema, isoDateSchema } from './common.ts';

export const goalSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1, 'Name is required').max(50),
  targetAmount: amountSchema,
  savedAmount: z.number().int().min(0),
  deadline: isoDateSchema.optional(),
  color: hexColorSchema,
});
export type Goal = z.infer<typeof goalSchema>;

export const createGoalSchema = goalSchema.omit({ id: true, savedAmount: true });
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = goalSchema.omit({ id: true }).partial();
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export const goalContributionSchema = z.object({
  amount: z
    .number()
    .int()
    .refine((n) => n !== 0, 'Amount cannot be zero'),
});
export type GoalContributionInput = z.infer<typeof goalContributionSchema>;
