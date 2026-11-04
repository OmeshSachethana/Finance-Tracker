import type { CreateGoalInput, UpdateGoalInput } from '@finance-tracker/shared';
import { badRequest, notFound } from '../../lib/errors.ts';
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

async function getGoal(userId: string, id: string) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) throw notFound('Goal not found');
  return goal;
}

export async function updateGoal(userId: string, id: string, input: UpdateGoalInput) {
  await getGoal(userId, id);
  return prisma.goal.update({
    where: { id },
    data: { ...input, deadline: input.deadline ? toDbDate(input.deadline) : undefined },
  });
}

export async function deleteGoal(userId: string, id: string) {
  await getGoal(userId, id);
  await prisma.goal.delete({ where: { id } });
}

/** Adds (or withdraws, if negative) money from a goal without going below zero. */
export async function contributeToGoal(userId: string, id: string, amount: number) {
  const goal = await getGoal(userId, id);
  if (goal.savedAmount + amount < 0) throw badRequest('Cannot withdraw more than is saved');
  return prisma.goal.update({ where: { id }, data: { savedAmount: { increment: amount } } });
}
