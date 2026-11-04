import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('adds an account with an opening balance, archives and deletes it', async ({ page }) => {
  const name = `Savings ${Date.now()}`;
  await login(page);
  await page.getByRole('link', { name: 'Accounts' }).click();

  await page.getByRole('button', { name: 'Add account' }).click();
  const form = page.getByRole('dialog', { name: 'Add account' });
  await form.getByLabel('Account name').fill(name);
  await form.getByLabel('Type').selectOption('savings');
  await form.getByLabel('Opening balance').fill('2500');
  await form.getByRole('button', { name: 'Add account' }).click();

  await expect(page.getByRole('heading', { name })).toBeVisible();
  await expect(page.getByText('$2,500.00')).toBeVisible();
  await snap(page, 'accounts');

  await page.getByRole('button', { name: `Archive ${name}` }).click();
  await expect(page.getByRole('button', { name: `Restore ${name}` })).toBeVisible();

  await page.getByRole('button', { name: `Delete ${name}` }).click();
  await page
    .getByRole('dialog', { name: 'Delete account?' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await expect(page.getByRole('heading', { name })).toHaveCount(0);
});
