import { z } from 'zod';
import { transactionTypeSchema } from './category.ts';
import { isoDateSchema } from './common.ts';

export const dateRangeSchema = z
  .object({ from: isoDateSchema, to: isoDateSchema })
  .refine((range) => range.from <= range.to, { message: 'from must be before to', path: ['to'] });
export type DateRange = z.infer<typeof dateRangeSchema>;

export const categoryBreakdownQuerySchema = z.object({
  from: isoDateSchema,
  to: isoDateSchema,
  type: transactionTypeSchema.default('expense'),
});

export const monthlyTrendQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(24).default(6),
});

export interface CategoryBreakdownItem {
  categoryId: string;
  total: number;
  count: number;
}

export interface MonthlyTrendItem {
  month: string;
  income: number;
  expense: number;
}
