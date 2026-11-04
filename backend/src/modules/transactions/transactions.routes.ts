import { createTransactionSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toTransactionDto } from './transactions.serializer.ts';
import { createTransaction } from './transactions.service.ts';

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);

transactionsRouter.post('/', validateBody(createTransactionSchema), async (req, res) => {
  const transaction = await createTransaction(req.user!.sub, req.body);
  res.status(201).json(toTransactionDto(transaction));
});
