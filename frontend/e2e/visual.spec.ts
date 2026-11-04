import { expect, test } from '@playwright/test';
import { login, snap } from './helpers';

test.describe('dark theme', () => {
  test.use({ colorScheme: 'dark' });

  test('dashboard renders in dark mode', async ({ page }) => {
    await login(page);
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByText('Spending by category')).toBeVisible();
    await snap(page, 'dashboard-dark');
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('navigation moves into a menu on small screens', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: /Hello/ })).toBeVisible();
    await snap(page, 'dashboard-mobile');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page
      .getByRole('dialog', { name: 'Menu' })
      .getByRole('link', { name: 'Transactions' })
      .click();
    await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
    await snap(page, 'transactions-mobile');
  });
});
