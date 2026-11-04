import { updateProfileSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toUserDto } from '../auth/auth.serializer.ts';
import { updateProfile } from './users.service.ts';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.patch('/me', validateBody(updateProfileSchema), async (req, res) => {
  const user = await updateProfile(req.user!.sub, req.body);
  res.json({ user: toUserDto(user) });
});
