import { nextOccurrence, type Frequency } from '@finance-tracker/shared';
import { fromDbDate, toDbDate } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';

/** Max occurrences to create per rule in one run, to avoid runaway loops. */
const MAX_CATCH_UP = 366;

/**
 * Creates transactions for every due occurrence up to `today` and moves each rule's
 * next run date forward. Rules past their end date are deactivated.
 * Returns the number of transactions created.
 */
export async function processDueRules(today: string, userId?: string): Promise<number> {
  const rules = await prisma.recurringRule.findMany({
    where: { active: true, nextRunDate: { lte: toDbDate(today) }, userId },
  });

  let created = 0;
  for (const rule of rules) {
    const frequency = rule.frequency.toLowerCase() as Frequency;
    const anchorDay = rule.startDate.getUTCDate();
    const endDate = rule.endDate ? fromDbDate(rule.endDate) : undefined;
    let next = fromDbDate(rule.nextRunDate);
    const dates: string[] = [];

    while (next <= today && (!endDate || next <= endDate) && dates.length < MAX_CATCH_UP) {
      dates.push(next);
      next = nextOccurrence(next, frequency, anchorDay);
    }

    await prisma.$transaction([
      prisma.transaction.createMany({
        data: dates.map((date) => ({
          userId: rule.userId,
          accountId: rule.accountId,
          categoryId: rule.categoryId,
          type: rule.type,
          amount: rule.amount,
          description: rule.description,
          date: toDbDate(date),
          tags: ['recurring'],
        })),
      }),
      prisma.recurringRule.update({
        where: { id: rule.id },
        data: { nextRunDate: toDbDate(next), active: !endDate || next <= endDate },
      }),
    ]);
    created += dates.length;
  }
  return created;
}
