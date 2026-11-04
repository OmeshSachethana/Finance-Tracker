import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.ts';
import { AppError } from '../lib/errors.ts';

/** Limits login and registration attempts per IP to slow down password guessing. */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.AUTH_RATE_LIMIT,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  handler: (_req, _res, next) => {
    next(new AppError(429, 'TOO_MANY_REQUESTS', 'Too many attempts, please try again later'));
  },
});
