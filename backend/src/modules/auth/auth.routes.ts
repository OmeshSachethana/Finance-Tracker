import { registerSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { validateBody } from '../../middleware/validate.ts';
import { toUserDto } from './auth.serializer.ts';
import { registerUser } from './auth.service.ts';
import { setRefreshCookie } from './cookies.ts';
import { createSession } from './session.service.ts';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), async (req, res) => {
  const user = await registerUser(req.body);
  const session = await createSession(user);
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
  res.status(201).json({ user: toUserDto(user), accessToken: session.accessToken });
});
