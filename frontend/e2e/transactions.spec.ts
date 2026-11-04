import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('lists the demo transactions', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Transactions' }).click();
  await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Monthly salary' }).first()).toBeVisible();
  await snap(page, 'transactions');
});

test('adds, edits and deletes a transaction', async ({ page }) => {
  const description = `E2E coffee ${Date.now()}`;
  await login(page);
  await page.goto('/transactions');

  await page.getByRole('button', { name: 'Add transaction' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Add transaction' });
  await dialog.getByLabel('Amount (USD)').fill('4.75');
  await dialog.getByLabel('Description').fill(description);
  await dialog.getByLabel('Category').selectOption({ label: 'Food & Dining' });
  await snap(page, 'transaction-form');
  await dialog.getByRole('button', { name: 'Add transaction' }).click();

  const row = page.getByRole('row', { name: new RegExp(description) });
  await expect(row).toContainText('$4.75');

  await row.getByRole('button', { name: `Edit ${description}` }).click();
  const edit = page.getByRole('dialog', { name: 'Edit transaction' });
  await edit.getByLabel('Amount (USD)').fill('5.25');
  await edit.getByRole('button', { name: 'Save changes' }).click();
  await expect(row).toContainText('$5.25');

  await row.getByRole('button', { name: `Delete ${description}` }).click();
  await page
    .getByRole('dialog', { name: 'Delete transaction?' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await expect(row).toHaveCount(0);
});

test('filters by search text', async ({ page }) => {
  await login(page);
  await page.goto('/transactions');
  await page.getByLabel('Search transactions').fill('salary');
  await expect(page).toHaveURL(/search=salary/);
  await expect(page.getByRole('cell', { name: 'Rent' })).toHaveCount(0);
});
