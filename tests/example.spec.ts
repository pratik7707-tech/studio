import { test, expect } from '@playwright/test';

test('should navigate to the home page', async ({ page }) => {
  // Start from the index page (the baseURL is set in the config)
  await page.goto('/');
  // The new page should have the title "Quantum Plus"
  await expect(page).toHaveTitle('Quantum Plus');
});

test('should show the main heading', async ({ page }) => {
    await page.goto('/');
    // Check for the main heading on the page
    const heading = page.getByRole('heading', { name: 'Integrated Budget' });
    await expect(heading).toBeVisible();
});
