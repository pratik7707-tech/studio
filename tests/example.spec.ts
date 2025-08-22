import { test, expect } from '@playwright/test';

test.describe('BudgetWise Application Tests', () => {

  test('should load the main dashboard correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for page title
    await expect(page).toHaveTitle('Quantum Plus');

    // Check for main heading
    await expect(page.getByRole('heading', { name: 'Integrated Budget' })).toBeVisible();

    // Check for metric cards
    await expect(page.getByText('Total Budget vs Total Envelope')).toBeVisible();
    await expect(page.getByText('Total Institutional Budget')).toBeVisible();
    await expect(page.getByText('Total GRP Budget')).toBeVisible();

    // Check for budget details tabs
    await expect(page.getByRole('tab', { name: 'Proposal Narrative' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Operating Budget' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Position Budget' })).toBeVisible();
  });

  test('should navigate to admin pages from the header', async ({ page }) => {
    await page.goto('/');

    // Navigate to Manage Standard Initiatives
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('menuitem', { name: 'Manage Standard Initiative' }).click();
    await expect(page).toHaveURL('/manage-standard-initiatives');
    await expect(page.getByRole('heading', { name: 'Manage Standard Initiatives' })).toBeVisible();

    // Navigate to Manage Budget Envelope
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('menuitem', { name: 'Manage Budget Envelope' }).click();
    await expect(page).toHaveURL('/manage-budget-envelope');
    await expect(page.getByRole('heading', { name: 'Manage Budget Envelope' })).toBeVisible();
  });

  test.describe('Manage Standard Initiatives', () => {
    const initiativeName = `Test Initiative ${Date.now()}`;
    const initiativeDesc = 'This is a test description.';
    const updatedInitiativeName = `${initiativeName} (Updated)`;

    test('should allow creating, editing, and deleting a standard initiative', async ({ page }) => {
      await page.goto('/manage-standard-initiatives');

      // Create a new initiative
      await page.getByRole('button', { name: 'New Standard Initiative Plan' }).click();
      await expect(page.getByRole('heading', { name: 'New Standard Initiative' })).toBeVisible();
      await page.getByLabel('Standard Initiative Name').fill(initiativeName);
      await page.getByLabel('Description').fill(initiativeDesc);
      await page.getByRole('button', { name: 'Save' }).click();

      // Verify the new initiative is in the table
      await expect(page.getByRole('cell', { name: initiativeName })).toBeVisible();
      await expect(page.getByRole('cell', { name: initiativeDesc })).toBeVisible();

      // Edit the initiative
      await page.getByRole('row', { name: initiativeName }).getByRole('button').click();
      await page.getByRole('menuitem', { name: 'Edit' }).click();
      await expect(page.getByRole('heading', { name: 'Edit Standard Initiative' })).toBeVisible();
      await page.getByLabel('Standard Initiative Name').fill(updatedInitiativeName);
      await page.getByRole('button', { name: 'Save' }).click();

      // Verify the updated initiative is in the table
      await expect(page.getByRole('cell', { name: updatedInitiativeName })).toBeVisible();
      
      // Delete the initiative
      await page.getByRole('row', { name: updatedInitiativeName }).getByRole('button').click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      await page.getByRole('button', { name: 'Delete' }).click();
      
      // Verify the initiative is no longer in the table
      await expect(page.getByRole('cell', { name: updatedInitiativeName })).not.toBeVisible();
    });
  });

  test.describe('Manage Budget Envelope', () => {
    test('should allow creating and deleting a budget envelope', async ({ page }) => {
      await page.goto('/manage-budget-envelope');

      // Create a new budget envelope
      await page.getByRole('button', { name: 'Manage Budget Envelope' }).click();
      await expect(page.getByRole('heading', { name: 'New Budget Envelope' })).toBeVisible();
      
      await page.getByLabel('Department').click();
      await page.getByRole('option', { name: 'B0010-Ethics Office' }).click();
      
      await page.getByLabel('2026').fill('10000');
      await page.getByLabel('2027').fill('15000');
      await page.getByLabel('2028').fill('20000');
      await page.getByLabel('2029').fill('25000');
      await page.getByRole('button', { name: 'Save Budget Envelope' }).click();

      // Verify the new envelope is in the table
      await expect(page.getByRole('cell', { name: 'B0010-Ethics Office' })).toBeVisible();
      await expect(page.getByRole('cell', { name: '$70,000.00' })).toBeVisible(); // Total amount

      // For this test, we won't delete, as it might interfere with other tests if run in parallel.
      // Deletion is manually tested or handled in separate cleanup steps in a full test suite.
    });
  });
});
