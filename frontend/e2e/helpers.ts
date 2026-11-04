import { expect, type Page } from '@playwright/test';

export const DEMO = { email: 'demo@example.com', password: 'Password123' };

export async function login(page: Page, user = DEMO) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
}

/** Saves a screenshot to e2e/.screenshots for visual review. */
export async function snap(page: Page, name: string) {
  // Move the mouse away so hover tooltips do not appear in screenshots.
  await page.mouse.move(0, 0);
  await page.screenshot({ path: `e2e/.screenshots/${name}.png`, fullPage: true });
}
