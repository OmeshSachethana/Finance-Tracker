import {
  createTransactionSchema,
  paginationSchema,
  transactionFiltersSchema,
  transactionSortSchema,
  updateTransactionSchema,
} from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody, validateQuery } from '../../middleware/validate.ts';
import { toTransactionDto } from './transactions.serializer.ts';
import {
  createTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from './transactions.service.ts';

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);

transactionsRouter.post('/', validateBody(createTransactionSchema), async (req, res) => {
  const transaction = await createTransaction(req.user!.sub, req.body);
  res.status(201).json(toTransactionDto(transaction));
});

const listQuerySchema = paginationSchema
  .extend(transactionFiltersSchema.shape)
  .extend(transactionSortSchema.shape);

transactionsRouter.get('/', validateQuery(listQuerySchema), async (req, res) => {
  const result = await listTransactions(req.user!.sub, res.locals.query);
  res.json({ ...result, items: result.items.map(toTransactionDto) });
});

transactionsRouter.get('/:id', async (req, res) => {
  const transaction = await getTransaction(req.user!.sub, req.params.id as string);
  res.json(toTransactionDto(transaction));
});

transactionsRouter.patch('/:id', validateBody(updateTransactionSchema), async (req, res) => {
  const transaction = await updateTransaction(req.user!.sub, req.params.id as string, req.body);
  res.json(toTransactionDto(transaction));
});
