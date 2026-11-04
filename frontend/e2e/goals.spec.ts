import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('creates a goal, saves towards it and completes it', async ({ page }) => {
  const name = `Holiday ${Date.now()}`;
  await login(page);
  await page.getByRole('link', { name: 'Goals' }).click();

  await page.getByRole('button', { name: 'New goal' }).first().click();
  const form = page.getByRole('dialog', { name: 'New goal' });
  await form.getByLabel('Goal name').fill(name);
  await form.getByLabel('Target (USD)').fill('500');
  await form.getByRole('button', { name: 'Create goal' }).click();

  const card = page.getByRole('article', { name });
  await card.getByRole('button', { name: 'Add money' }).click();
  await page.getByRole('dialog', { name }).getByLabel('Amount (USD)').fill('200');
  await page.getByRole('dialog', { name }).getByRole('button', { name: 'Add money' }).click();
  await expect(card.getByText('40% saved')).toBeVisible();
  await snap(page, 'goals');

  await card.getByRole('button', { name: 'Add money' }).click();
  await page.getByRole('dialog', { name }).getByLabel('Amount (USD)').fill('300');
  await page.getByRole('dialog', { name }).getByRole('button', { name: 'Add money' }).click();
  await expect(card.getByText('Completed')).toBeVisible();

  await card.getByRole('button', { name: `Delete ${name}` }).click();
  await page
    .getByRole('dialog', { name: 'Delete goal?' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await expect(page.getByRole('heading', { name })).toHaveCount(0);
});
