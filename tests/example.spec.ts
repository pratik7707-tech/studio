import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Quantum Plus');
});

test('has heading', async ({ page }) => {
    await page.goto('/');
  
    // Expect the heading to be visible
    const heading = page.getByRole('heading', { name: 'Integrated Budget' });
    await expect(heading).toBeVisible();
});
