import { createAccountSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toAccountDto } from './accounts.serializer.ts';
import { createAccount, listAccounts } from './accounts.service.ts';

export const accountsRouter = Router();

accountsRouter.use(authenticate);

accountsRouter.get('/', async (req, res) => {
  const accounts = await listAccounts(req.user!.sub);
  res.json({ items: accounts.map(({ account, balance }) => toAccountDto(account, balance)) });
});

accountsRouter.post('/', validateBody(createAccountSchema), async (req, res) => {
  const account = await createAccount(req.user!.sub, req.body);
  res.status(201).json(toAccountDto(account, account.openingBalance));
});
