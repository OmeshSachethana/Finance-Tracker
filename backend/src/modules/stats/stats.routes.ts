import { dateRangeSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateQuery } from '../../middleware/validate.ts';
import { getSummary } from './stats.service.ts';

export const statsRouter = Router();

statsRouter.use(authenticate);

statsRouter.get('/summary', validateQuery(dateRangeSchema), async (req, res) => {
  res.json(await getSummary(req.user!.sub, res.locals.query));
});
