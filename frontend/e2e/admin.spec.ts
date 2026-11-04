import { expect, test } from '@playwright/test';
import { DEMO, login, snap } from './helpers';

const ADMIN = { email: 'admin@example.com', password: 'Password123' };

test('admins can see platform stats and users', async ({ page }) => {
  await login(page, ADMIN);
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();
  await page.getByLabel('Search users').fill('demo');
  await expect(page.getByText('1 result', { exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: /demo@example.com/ })).toBeVisible();
  await snap(page, 'admin');
});

test('regular users cannot open the admin page', async ({ page }) => {
  await login(page, DEMO);
  await expect(page.getByRole('link', { name: 'Admin' })).toHaveCount(0);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: /Hello/ })).toBeVisible();
});
