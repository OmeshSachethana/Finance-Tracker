import { createGoalSchema, updateGoalSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toGoalDto } from './goals.serializer.ts';
import { createGoal, deleteGoal, listGoals, updateGoal } from './goals.service.ts';

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

goalsRouter.patch('/:id', validateBody(updateGoalSchema), async (req, res) => {
  res.json(toGoalDto(await updateGoal(req.user!.sub, req.params.id as string, req.body)));
});

goalsRouter.delete('/:id', async (req, res) => {
  await deleteGoal(req.user!.sub, req.params.id as string);
  res.status(204).end();
});
