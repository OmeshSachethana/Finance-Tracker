import { changePasswordSchema, updateProfileSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toUserDto } from '../auth/auth.serializer.ts';
import { changePassword, updateProfile } from './users.service.ts';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.patch('/me', validateBody(updateProfileSchema), async (req, res) => {
  const user = await updateProfile(req.user!.sub, req.body);
  res.json({ user: toUserDto(user) });
});

usersRouter.post('/me/password', validateBody(changePasswordSchema), async (req, res) => {
  await changePassword(req.user!.sub, req.body);
  res.status(204).end();
});
