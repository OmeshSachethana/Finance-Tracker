import type { Frequency, RecurringRule as RecurringRuleDto } from '@finance-tracker/shared';
import type { RecurringRule } from '../../generated/prisma/client.ts';
import { fromDbDate, fromDbTransactionType } from '../../lib/mappers.ts';

export function toRecurringRuleDto(rule: RecurringRule): RecurringRuleDto {
  return {
    id: rule.id,
    type: fromDbTransactionType(rule.type),
    amount: rule.amount,
    description: rule.description,
    categoryId: rule.categoryId,
    accountId: rule.accountId,
    frequency: rule.frequency.toLowerCase() as Frequency,
    startDate: fromDbDate(rule.startDate),
    endDate: rule.endDate ? fromDbDate(rule.endDate) : undefined,
    nextRunDate: fromDbDate(rule.nextRunDate),
    active: rule.active,
  };
}
