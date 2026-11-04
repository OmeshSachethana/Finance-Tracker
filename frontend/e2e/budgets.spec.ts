import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('shows seeded budgets and updates a limit', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Budgets' }).click();
  await expect(page.getByRole('heading', { name: 'Budgets', exact: true })).toBeVisible();

  const housing = page.getByRole('article', { name: 'Housing' });
  await expect(housing).toContainText('Close to limit');
  await snap(page, 'budgets');

  await page.getByRole('button', { name: 'Edit Housing budget' }).click();
  const edit = page.getByRole('dialog', { name: 'Edit budget' });
  await edit.getByLabel('Monthly limit (USD)').fill('1000');
  await edit.getByRole('button', { name: 'Save changes' }).click();
  await expect(housing).toContainText('Over budget');

  // Put the seeded limit back for other tests.
  await page.getByRole('button', { name: 'Edit Housing budget' }).click();
  await edit.getByLabel('Monthly limit (USD)').fill('1600');
  await edit.getByRole('button', { name: 'Save changes' }).click();
  await expect(housing).toContainText('Close to limit');
});

test('adds and removes a budget', async ({ page }) => {
  await login(page);
  await page.goto('/budgets');

  await page.getByRole('button', { name: 'Add budget' }).first().click();
  const form = page.getByRole('dialog', { name: 'Add budget' });
  await form.getByLabel('Category').selectOption({ label: 'Health' });
  await form.getByLabel('Monthly limit (USD)').fill('100');
  await form.getByRole('button', { name: 'Add budget' }).click();

  const health = page.getByRole('article', { name: 'Health' });
  await expect(health).toContainText('On track');

  await page.getByRole('button', { name: 'Delete Health budget' }).click();
  await page
    .getByRole('dialog', { name: 'Delete budget?' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await expect(health).toHaveCount(0);
});
