import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test('shows reports for a chosen period', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'Reports' }).click();
  await expect(page.getByText('Income by category')).toBeVisible();
  await expect(page.getByText('Salary')).toBeVisible();
  await snap(page, 'reports');

  await page.getByLabel('Period').selectOption('last-year');
  await expect(page.getByText('No income in this period')).toBeVisible();
});

test('exports the period as CSV', async ({ page }) => {
  await login(page);
  await page.goto('/reports');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export period' }).click();
  expect((await download).suggestedFilename()).toMatch(/^transactions-.*\.csv$/);
});
