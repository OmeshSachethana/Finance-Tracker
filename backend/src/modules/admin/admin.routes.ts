import { paginationSchema, userRoleSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/authenticate.ts';
import { requireRole } from '../../middleware/requireRole.ts';
import { validateBody, validateQuery } from '../../middleware/validate.ts';
import { toUserDto } from '../auth/auth.serializer.ts';
import { getPlatformStats, listUsers, setUserRole } from './admin.service.ts';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/stats', async (_req, res) => {
  res.json(await getPlatformStats());
});

const listUsersQuery = paginationSchema.extend({ search: z.string().trim().max(100).optional() });

adminRouter.get('/users', validateQuery(listUsersQuery), async (_req, res) => {
  const { users, ...page } = await listUsers(res.locals.query);
  res.json({
    ...page,
    items: users.map((u) => ({
      ...toUserDto(u),
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      transactionCount: u._count.transactions,
    })),
  });
});

const roleSchema = z.object({ role: userRoleSchema });

adminRouter.patch('/users/:id/role', validateBody(roleSchema), async (req, res) => {
  const role = req.body.role === 'admin' ? 'ADMIN' : 'USER';
  const user = await setUserRole(req.user!.sub, req.params.id as string, role);
  res.json({ user: toUserDto(user) });
});
