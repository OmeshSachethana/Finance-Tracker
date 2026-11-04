import type { CreateGoalInput } from '@finance-tracker/shared';
import { toDbDate } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';

export function listGoals(userId: string) {
  return prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
}

export function createGoal(userId: string, input: CreateGoalInput) {
  return prisma.goal.create({
    data: { ...input, deadline: input.deadline ? toDbDate(input.deadline) : undefined, userId },
  });
}
