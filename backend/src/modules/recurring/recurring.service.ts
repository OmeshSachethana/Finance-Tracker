import type { CreateRecurringRuleInput, UpdateRecurringRuleInput } from '@finance-tracker/shared';
import type { Frequency as DbFrequency } from '../../generated/prisma/client.ts';
import { badRequest, notFound } from '../../lib/errors.ts';
import { toDbDate, toDbTransactionType } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';
import { getAccount } from '../accounts/accounts.service.ts';
import { getCategory } from '../categories/categories.service.ts';

export function listRecurringRules(userId: string) {
  return prisma.recurringRule.findMany({ where: { userId }, orderBy: { nextRunDate: 'asc' } });
}

export async function createRecurringRule(userId: string, input: CreateRecurringRuleInput) {
  const [category] = await Promise.all([
    getCategory(userId, input.categoryId),
    getAccount(userId, input.accountId),
  ]);
  const type = toDbTransactionType(input.type);
  if (category.type !== type) throw badRequest('Category type does not match the rule type');

  return prisma.recurringRule.create({
    data: {
      ...input,
      userId,
      type,
      frequency: input.frequency.toUpperCase() as DbFrequency,
      startDate: toDbDate(input.startDate),
      endDate: input.endDate ? toDbDate(input.endDate) : undefined,
      nextRunDate: toDbDate(input.startDate),
    },
  });
}

async function getRecurringRule(userId: string, id: string) {
  const rule = await prisma.recurringRule.findFirst({ where: { id, userId } });
  if (!rule) throw notFound('Recurring rule not found');
  return rule;
}

export async function updateRecurringRule(
  userId: string,
  id: string,
  input: UpdateRecurringRuleInput,
) {
  await getRecurringRule(userId, id);
  return prisma.recurringRule.update({
    where: { id },
    data: { ...input, endDate: input.endDate ? toDbDate(input.endDate) : undefined },
  });
}

export async function deleteRecurringRule(userId: string, id: string) {
  await getRecurringRule(userId, id);
  await prisma.recurringRule.delete({ where: { id } });
}
