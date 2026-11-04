import { createRecurringRuleSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toRecurringRuleDto } from './recurring.serializer.ts';
import { createRecurringRule, listRecurringRules } from './recurring.service.ts';

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
