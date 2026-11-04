import type { ErrorRequestHandler } from 'express';
import { AppError } from '../lib/errors.ts';

/** Errors thrown by Express body parsing carry a `type` and a 4xx `status`. */
function isBodyParserError(err: unknown): err is { status: number; type: string } {
  return typeof err === 'object' && err !== null && 'type' in err && 'status' in err;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  if (isBodyParserError(err)) {
    const tooLarge = err.type === 'entity.too.large';
    res.status(err.status).json({
      error: {
        code: tooLarge ? 'PAYLOAD_TOO_LARGE' : 'BAD_REQUEST',
        message: tooLarge ? 'Request body is too large' : 'Invalid request body',
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  });
};
