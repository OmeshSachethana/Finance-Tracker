import { loginSchema, registerSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { unauthorized } from '../../lib/errors.ts';
import { prisma } from '../../lib/prisma.ts';
import { verifyAccessToken } from '../../lib/tokens.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toUserDto } from './auth.serializer.ts';
import { loginUser, registerUser } from './auth.service.ts';
import { REFRESH_COOKIE, setRefreshCookie } from './cookies.ts';
import { createSession, rotateSession } from './session.service.ts';

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

  const session = await rotateSession(token);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: (await verifyAccessToken(session.accessToken)).sub },
  });
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
  res.json({ user: toUserDto(user), accessToken: session.accessToken });
});
