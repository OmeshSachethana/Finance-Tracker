import { createAccountSchema, updateAccountSchema } from '@finance-tracker/shared';
import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.ts';
import { validateBody } from '../../middleware/validate.ts';
import { toAccountDto } from './accounts.serializer.ts';
import { createAccount, listAccounts, updateAccount } from './accounts.service.ts';

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

accountsRouter.patch('/:id', validateBody(updateAccountSchema), async (req, res) => {
  const account = await updateAccount(req.user!.sub, req.params.id as string, req.body);
  const balances = await listAccounts(req.user!.sub);
  const balance = balances.find((b) => b.account.id === account.id)?.balance ?? 0;
  res.json(toAccountDto(account, balance));
});
