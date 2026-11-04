import {
  createRecurringRuleSchema,
  toISODate,
  updateRecurringRuleSchema,
} from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { processDueRules } from './recurring.processor.ts';
import { toRecurringRuleDto } from './recurring.serializer.ts';
import {
  createRecurringRule,
  deleteRecurringRule,
  listRecurringRules,
  updateRecurringRule,
} from './recurring.service.ts';

export const recurringRouter = Router();

recurringRouter.use(authenticate);

recurringRouter.get('/', async (req, res) => {
  const rules = await listRecurringRules(req.user!.sub);
  res.json({ items: rules.map(toRecurringRuleDto) });
});

recurringRouter.post('/', validateBody(createRecurringRuleSchema), async (req, res) => {
  const rule = await createRecurringRule(req.user!.sub, req.body);
  res.status(201).json(toRecurringRuleDto(rule));
});

recurringRouter.post('/run', async (req, res) => {
  const created = await processDueRules(toISODate(new Date()), req.user!.sub);
  res.json({ created });
});

recurringRouter.patch('/:id', validateBody(updateRecurringRuleSchema), async (req, res) => {
  const rule = await updateRecurringRule(req.user!.sub, req.params.id as string, req.body);
  res.json(toRecurringRuleDto(rule));
});

recurringRouter.delete('/:id', async (req, res) => {
  await deleteRecurringRule(req.user!.sub, req.params.id as string);
  res.status(204).end();
});
