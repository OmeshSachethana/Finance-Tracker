import type { Express } from 'express';
import request from 'supertest';
import { authHeader } from './auth.ts';

/** Registers a user and returns their auth header plus default account and category ids. */
export async function userWithDefaults(app: Express) {
  const auth = await authHeader(app);
  const headers = { Authorization: auth.Authorization };
  const [accounts, categories] = await Promise.all([
    request(app).get('/api/accounts').set(headers),
    request(app).get('/api/categories').set(headers),
  ]);
  const byName = (name: string) =>
    categories.body.items.find((c: { name: string }) => c.name === name).id as string;

  return {
    headers,
    accountId: accounts.body.items[0].id as string,
    groceriesId: byName('Groceries'),
    salaryId: byName('Salary'),
  };
}
