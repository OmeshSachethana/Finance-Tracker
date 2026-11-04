import type { RequestHandler } from 'express';
import { z } from 'zod';
import { badRequest } from '../lib/errors.ts';

/** Validates and replaces `req.body` with the parsed result. */
export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(badRequest('Validation failed', z.flattenError(result.error).fieldErrors));
      return;
    }
    req.body = result.data;
    next();
  };
}

/** Validates query params and stores the parsed result on `res.locals.query`. */
export function validateQuery(schema: z.ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(badRequest('Invalid query parameters', z.flattenError(result.error).fieldErrors));
      return;
    }
    res.locals.query = result.data;
    next();
  };
}
