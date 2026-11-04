import { expect, test } from '@playwright/test';
import { snap } from './helpers';

test('registers, updates settings and deletes the account', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto('/register');
  await page.getByLabel('Name').fill('Sam Tester');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('Secret123');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Hello, Sam' })).toBeVisible();

  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByLabel('Name').fill('Samira Tester');
  await page.getByLabel('Display currency').selectOption('EUR');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByText('Profile saved')).toBeVisible();
  await expect(page.getByText('Samira Tester')).toBeVisible();
  await snap(page, 'settings');

  await page.getByLabel('Current password').fill('Secret123');
  await page.getByLabel('New password', { exact: true }).fill('Secret456');
  await page.getByLabel('Confirm new password').fill('Secret456');
  await page.getByRole('button', { name: 'Change password' }).click();
  await expect(page.getByText(/Password changed/)).toBeVisible();

  await page.getByRole('button', { name: 'Delete account' }).click();
  const dialog = page.getByRole('dialog', { name: 'Delete your account?' });
  await dialog.getByLabel('Confirm with your password').fill('Secret456');
  await dialog.getByRole('button', { name: 'Delete forever' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('Secret456');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid email or password');
});
