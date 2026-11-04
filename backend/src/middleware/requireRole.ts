import type { RequestHandler } from 'express';
import { forbidden, unauthorized } from '../lib/errors.ts';
import type { AccessTokenPayload } from '../lib/tokens.ts';

export function requireRole(role: AccessTokenPayload['role']): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(unauthorized());
      return;
    }
    if (req.user.role !== role) {
      next(forbidden());
      return;
    }
    next();
  };
}
