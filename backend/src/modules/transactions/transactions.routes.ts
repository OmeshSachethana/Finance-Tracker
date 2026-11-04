import { createTransactionSchema, paginationSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody, validateQuery } from '../../middleware/validate.ts';
import { toTransactionDto } from './transactions.serializer.ts';
import { createTransaction, listTransactions } from './transactions.service.ts';

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);

transactionsRouter.post('/', validateBody(createTransactionSchema), async (req, res) => {
  const transaction = await createTransaction(req.user!.sub, req.body);
  res.status(201).json(toTransactionDto(transaction));
});

transactionsRouter.get('/', validateQuery(paginationSchema), async (req, res) => {
  const result = await listTransactions(req.user!.sub, res.locals.query);
  res.json({ ...result, items: result.items.map(toTransactionDto) });
});
