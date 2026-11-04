import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { toAccountDto } from './accounts.serializer.ts';
import { listAccounts } from './accounts.service.ts';

export const accountsRouter = Router();

accountsRouter.use(authenticate);

accountsRouter.get('/', async (req, res) => {
  const accounts = await listAccounts(req.user!.sub);
  res.json({ items: accounts.map(({ account, balance }) => toAccountDto(account, balance)) });
});
