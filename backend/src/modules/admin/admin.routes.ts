import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { requireRole } from '../../middleware/requireRole.ts';
import { getPlatformStats } from './admin.service.ts';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/stats', async (_req, res) => {
  res.json(await getPlatformStats());
});
