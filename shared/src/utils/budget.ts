export type BudgetStatus = 'ok' | 'warning' | 'exceeded';

export interface BudgetProgress {
  spent: number;
  remaining: number;
  percent: number;
  status: BudgetStatus;
}

/** Works out how much of a budget is used and whether to warn. */
export function getBudgetProgress(
  limit: number,
  spent: number,
  alertThreshold = 80,
): BudgetProgress {
  const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  let status: BudgetStatus = 'ok';
  if (spent > limit) status = 'exceeded';
  else if (percent >= alertThreshold) status = 'warning';
  return { spent, remaining: limit - spent, percent, status };
}
