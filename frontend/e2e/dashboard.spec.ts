import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('shows the monthly summary and charts', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('heading', { name: 'Hello, Demo' })).toBeVisible();
  await expect(page.getByText('Spending by category')).toBeVisible();
  await expect(page.getByRole('img', { name: /monthly income and expenses/ })).toBeVisible();
  await snap(page, 'dashboard');
});

test('switches the trend chart to a table', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Show table' }).click();
  await expect(page.getByRole('columnheader', { name: 'Net' })).toBeVisible();
});
