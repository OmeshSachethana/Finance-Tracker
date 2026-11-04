import {
  bulkDeleteSchema,
  createTransactionSchema,
  paginationSchema,
  transactionFiltersSchema,
  transactionSortSchema,
  updateTransactionSchema,
} from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody, validateQuery } from '../../middleware/validate.ts';
import { exportTransactionsCsv } from './transactions.export.ts';
import { toTransactionDto } from './transactions.serializer.ts';
import {
  createTransaction,
  deleteTransaction,
  deleteTransactions,
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

transactionsRouter.get('/export', validateQuery(transactionFiltersSchema), async (req, res) => {
  const csv = await exportTransactionsCsv(req.user!.sub, res.locals.query);
  res.attachment('transactions.csv').type('text/csv').send(csv);
});

transactionsRouter.post('/bulk-delete', validateBody(bulkDeleteSchema), async (req, res) => {
  const deleted = await deleteTransactions(req.user!.sub, req.body.ids);
  res.json({ deleted });
});

transactionsRouter.get('/:id', async (req, res) => {
  const transaction = await getTransaction(req.user!.sub, req.params.id as string);
  res.json(toTransactionDto(transaction));
});

transactionsRouter.patch('/:id', validateBody(updateTransactionSchema), async (req, res) => {
  const transaction = await updateTransaction(req.user!.sub, req.params.id as string, req.body);
  res.json(toTransactionDto(transaction));
});

transactionsRouter.delete('/:id', async (req, res) => {
  await deleteTransaction(req.user!.sub, req.params.id as string);
  res.status(204).end();
});
