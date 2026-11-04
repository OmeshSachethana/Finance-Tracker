import type { AccessTokenPayload } from '../lib/tokens.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
