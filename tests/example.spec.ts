
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Quantum Plus/);
});

test('has integrated budget heading', async ({ page }) => {
  await page.goto('/');

  // Expect the main heading to be visible.
  await expect(page.getByRole('heading', { name: 'Integrated Budget' })).toBeVisible();
});
