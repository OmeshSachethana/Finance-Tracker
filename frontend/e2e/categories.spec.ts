import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('adds, renames and deletes a category', async ({ page }) => {
  const name = `Pets ${Date.now()}`;
  await login(page);
  await page.getByRole('link', { name: 'Categories' }).click();

  await page.getByRole('button', { name: 'Add' }).first().click();
  const form = page.getByRole('dialog', { name: 'Add category' });
  await form.getByLabel('Name').fill(name);
  await form.getByRole('radio', { name: 'paw print' }).click();
  await form.getByRole('button', { name: 'Add category' }).click();
  await expect(page.getByText(name)).toBeVisible();
  await snap(page, 'categories');

  await page.getByRole('button', { name: `Edit ${name}` }).click();
  await page
    .getByRole('dialog', { name: 'Edit category' })
    .getByLabel('Name')
    .fill(`${name} & Vet`);
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText(`${name} & Vet`)).toBeVisible();

  await page.getByRole('button', { name: `Delete ${name} & Vet` }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(`${name} & Vet`)).toHaveCount(0);
});

test('asks where to move transactions when deleting a used category', async ({ page }) => {
  await login(page);
  await page.goto('/categories');
  await page.getByRole('button', { name: 'Delete Groceries' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByLabel('Move transactions to')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
});
