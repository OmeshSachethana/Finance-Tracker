import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('adds, edits and removes a budget', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Budgets' }).click();
  await expect(page.getByRole('heading', { name: 'Budgets', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Add budget' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Add budget' });
  await dialog.getByLabel('Category').selectOption({ label: 'Housing' });
  await dialog.getByLabel('Monthly limit (USD)').fill('1600');
  await dialog.getByRole('button', { name: 'Add budget' }).click();

  await expect(page.getByText('Close to limit')).toBeVisible();
  await snap(page, 'budgets');

  await page.getByRole('button', { name: 'Edit Housing budget' }).click();
  await page
    .getByRole('dialog', { name: 'Edit budget' })
    .getByLabel('Monthly limit (USD)')
    .fill('1000');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Over budget')).toBeVisible();

  await page.getByRole('button', { name: 'Delete Housing budget' }).click();
  await page
    .getByRole('dialog', { name: 'Delete budget?' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await expect(page.getByText('No budgets for this month')).toBeVisible();
});
