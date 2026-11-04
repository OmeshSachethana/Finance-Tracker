import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.ts';
import { logger } from './lib/logger.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { notFoundHandler } from './middleware/notFound.ts';
import { accountsRouter } from './modules/accounts/accounts.routes.ts';
import { authRouter } from './modules/auth/auth.routes.ts';
import { budgetsRouter } from './modules/budgets/budgets.routes.ts';
import { categoriesRouter } from './modules/categories/categories.routes.ts';
import { recurringRouter } from './modules/recurring/recurring.routes.ts';
import { statsRouter } from './modules/stats/stats.routes.ts';
import { transactionsRouter } from './modules/transactions/transactions.routes.ts';
import { usersRouter } from './modules/users/users.routes.ts';
import { goalsRouter } from './modules/goals/goals.routes.ts';
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
  app.use('/api/users', usersRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/accounts', accountsRouter);
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/stats', statsRouter);
  app.use('/api/budgets', budgetsRouter);
  app.use('/api/goals', goalsRouter);
  app.use('/api/recurring', recurringRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
