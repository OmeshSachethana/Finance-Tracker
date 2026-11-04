import { createBudgetSchema, monthKeySchema, toMonthKey } from '@finance-tracker/shared';
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody, validateQuery } from '../../middleware/validate.ts';
import { toBudgetDto } from './budgets.serializer.ts';
import { createBudget, listBudgets } from './budgets.service.ts';

export const budgetsRouter = Router();

budgetsRouter.use(authenticate);

const monthQuerySchema = z.object({ month: monthKeySchema.default(() => toMonthKey(new Date())) });

budgetsRouter.get('/', validateQuery(monthQuerySchema), async (req, res) => {
  const budgets = await listBudgets(req.user!.sub, res.locals.query.month);
  res.json({ items: budgets.map(({ budget, spent }) => toBudgetDto(budget, spent)) });
});

budgetsRouter.post('/', validateBody(createBudgetSchema), async (req, res) => {
  const budget = await createBudget(req.user!.sub, req.body);
  res.status(201).json(toBudgetDto(budget, 0));
});
