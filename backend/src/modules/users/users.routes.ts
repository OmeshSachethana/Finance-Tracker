import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toUserDto } from '../auth/auth.serializer.ts';
import { clearRefreshCookie } from '../auth/cookies.ts';
import { changePassword, deleteAccount, updateProfile } from './users.service.ts';

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

usersRouter.delete('/me', validateBody(deleteAccountSchema), async (req, res) => {
  await deleteAccount(req.user!.sub, req.body.password);
  clearRefreshCookie(res);
  res.status(204).end();
});
