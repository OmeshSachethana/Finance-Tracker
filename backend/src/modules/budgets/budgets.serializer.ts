import {
  getBudgetProgress,
  type Budget as BudgetDto,
  type BudgetProgress,
} from '@finance-tracker/shared';
import type { Budget } from '../../generated/prisma/client.ts';

export function toBudgetDto(budget: Budget, spent: number): BudgetDto & BudgetProgress {
  return {
    id: budget.id,
    categoryId: budget.categoryId,
    month: budget.month,
    limit: budget.limit,
    alertThreshold: budget.alertThreshold,
    ...getBudgetProgress(budget.limit, spent, budget.alertThreshold),
  };
}
