import type { Goal as GoalDto } from '@finance-tracker/shared';
import type { Goal } from '../../generated/prisma/client.ts';
import { fromDbDate } from '../../lib/mappers.ts';

export function toGoalDto(goal: Goal): GoalDto & { percent: number; completed: boolean } {
  const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: goal.targetAmount,
    savedAmount: goal.savedAmount,
    deadline: goal.deadline ? fromDbDate(goal.deadline) : undefined,
    color: goal.color,
    percent,
    completed: goal.savedAmount >= goal.targetAmount,
  };
}
