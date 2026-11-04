import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('lists the demo transactions', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Transactions' }).click();
  await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Monthly salary' }).first()).toBeVisible();
  await snap(page, 'transactions');
});
