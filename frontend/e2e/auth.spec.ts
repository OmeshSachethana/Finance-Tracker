import { expect, test } from '@playwright/test';
import { DEMO, login, snap } from './helpers';

test('shows the login page to signed-out visitors', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  await snap(page, 'login');
});

test('rejects a wrong password', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(DEMO.email);
  await page.getByLabel('Password').fill('WrongPassword1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid email or password');
});

test('signs in and out', async ({ page }) => {
  await login(page);
  await expect(page.getByText('Demo User')).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});

test('keeps the session after a reload', async ({ page }) => {
  await login(page);
  await page.reload();
  await expect(page.getByText('Demo User')).toBeVisible();
});
