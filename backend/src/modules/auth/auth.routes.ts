import { loginSchema, registerSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { unauthorized } from '../../lib/errors.ts';
import { prisma } from '../../lib/prisma.ts';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toUserDto } from './auth.serializer.ts';
import { loginUser, registerUser } from './auth.service.ts';
import { clearRefreshCookie, REFRESH_COOKIE, setRefreshCookie } from './cookies.ts';
import { createSession, revokeSession, rotateSession } from './session.service.ts';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), async (req, res) => {
  const user = await registerUser(req.body);
  const session = await createSession(user);
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
  res.status(201).json({ user: toUserDto(user), accessToken: session.accessToken });
});

authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const user = await loginUser(req.body);
  const session = await createSession(user);
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
  res.json({ user: toUserDto(user), accessToken: session.accessToken });
});

authRouter.post('/refresh', async (req, res) => {
  const token: unknown = req.cookies?.[REFRESH_COOKIE];
  if (typeof token !== 'string') throw unauthorized('No session');

  const { user, ...session } = await rotateSession(token);
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
  res.json({ user: toUserDto(user), accessToken: session.accessToken });
});

authRouter.post('/logout', async (req, res) => {
  const token: unknown = req.cookies?.[REFRESH_COOKIE];
  if (typeof token === 'string') await revokeSession(token);
  clearRefreshCookie(res);
  res.status(204).end();
});

authRouter.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) throw unauthorized('User no longer exists');
  res.json({ user: toUserDto(user) });
});
