import { expect, type Page } from '@playwright/test';

export const DEMO = { email: 'demo@example.com', password: 'Password123' };

export async function login(page: Page, user = DEMO) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
}

/** Saves a screenshot to e2e/.screenshots for visual review. */
export async function snap(page: Page, name: string) {
  await page.screenshot({ path: `e2e/.screenshots/${name}.png`, fullPage: true });
}
