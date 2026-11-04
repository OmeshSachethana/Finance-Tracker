import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('creates, pauses and deletes a recurring rule', async ({ page }) => {
  const description = `Streaming ${Date.now()}`;
  await login(page);
  await page.getByRole('link', { name: 'Recurring' }).click();

  await page.getByRole('button', { name: 'New rule' }).first().click();
  const form = page.getByRole('dialog', { name: 'New recurring rule' });
  await form.getByLabel('Amount (USD)').fill('12.99');
  await form.getByLabel('Description').fill(description);
  await form.getByLabel('Category').selectOption({ label: 'Entertainment' });
  await form.getByLabel('Starts').fill('2099-01-15');
  await form.getByRole('button', { name: 'Create rule' }).click();

  const row = page.getByRole('listitem').filter({ hasText: description });
  await expect(row).toContainText('Next on 15 Jan 2099');
  await snap(page, 'recurring');

  await page.getByRole('button', { name: `Pause ${description}` }).click();
  await expect(row).toContainText('Paused');

  await page.getByRole('button', { name: `Delete ${description}` }).click();
  await page
    .getByRole('dialog', { name: 'Delete recurring rule?' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await expect(row).toHaveCount(0);
});
