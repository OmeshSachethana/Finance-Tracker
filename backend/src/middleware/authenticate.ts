import type { RequestHandler } from 'express';
import { unauthorized } from '../lib/errors.ts';
import { verifyAccessToken } from '../lib/tokens.ts';

/** Requires a valid `Authorization: Bearer <token>` header. */
export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(unauthorized());
    return;
  }

  try {
    req.user = await verifyAccessToken(header.slice('Bearer '.length));
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
};
