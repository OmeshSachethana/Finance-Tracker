import { createGoalSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toGoalDto } from './goals.serializer.ts';
import { createGoal, listGoals } from './goals.service.ts';

export const goalsRouter = Router();

goalsRouter.use(authenticate);

goalsRouter.get('/', async (req, res) => {
  const goals = await listGoals(req.user!.sub);
  res.json({ items: goals.map(toGoalDto) });
});

goalsRouter.post('/', validateBody(createGoalSchema), async (req, res) => {
  const goal = await createGoal(req.user!.sub, req.body);
  res.status(201).json(toGoalDto(goal));
});
