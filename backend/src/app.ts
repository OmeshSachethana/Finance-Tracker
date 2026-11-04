import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.ts';
import { logger } from './lib/logger.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { notFoundHandler } from './middleware/notFound.ts';
import { authRouter } from './modules/auth/auth.routes.ts';
import { healthRouter } from './routes/health.ts';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
