import { test, expect } from '@playwright/test';

test.describe('BudgetWise Application Tests', () => {

  test('should load the main dashboard correctly', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle('Quantum Plus');
    await expect(page.getByRole('heading', { name: 'Integrated Budget' })).toBeVisible();
    await expect(page.getByText('Total Budget vs Total Envelope')).toBeVisible();
    await expect(page.getByText('Total Institutional Budget')).toBeVisible();
    await expect(page.getByText('Total GRP Budget')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Proposal Narrative' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Operating Budget' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Position Budget' })).toBeVisible();
  });

  test('should navigate to admin pages from the header', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('menuitem', { name: 'Manage Standard Initiative' }).click();
    await expect(page).toHaveURL('/manage-standard-initiatives');
    await expect(page.getByRole('heading', { name: 'Manage Standard Initiatives' })).toBeVisible();

    await page.goto('/');
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

      // Create
      await page.getByRole('button', { name: 'New Standard Initiative Plan' }).click();
      await expect(page.getByRole('heading', { name: 'New Standard Initiative' })).toBeVisible();
      await page.getByLabel('Standard Initiative Name').fill(initiativeName);
      await page.getByLabel('Description').fill(initiativeDesc);
      await page.getByRole('button', { name: 'Save' }).click();

      // Verify creation
      await expect(page.getByRole('cell', { name: initiativeName })).toBeVisible();
      await expect(page.getByRole('cell', { name: initiativeDesc })).toBeVisible();

      // Edit
      await page.getByRole('row', { name: initiativeName }).getByRole('button').click();
      await page.getByRole('menuitem', { name: 'Edit' }).click();
      await expect(page.getByRole('heading', { name: 'Edit Standard Initiative' })).toBeVisible();
      await page.getByLabel('Standard Initiative Name').fill(updatedInitiativeName);
      await page.getByRole('button', { name: 'Save' }).click();

      // Verify edit
      await expect(page.getByRole('cell', { name: updatedInitiativeName })).toBeVisible();
      
      // Delete
      await page.getByRole('row', { name: updatedInitiativeName }).getByRole('button').click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      await page.getByRole('button', { name: 'Delete' }).click();
      
      // Verify deletion
      await expect(page.getByRole('cell', { name: updatedInitiativeName })).not.toBeVisible();
    });

    test('should show errors for empty fields on standard initiative creation', async ({ page }) => {
      await page.goto('/manage-standard-initiatives');

      await page.getByRole('button', { name: 'New Standard Initiative Plan' }).click();
      await expect(page.getByRole('heading', { name: 'New Standard Initiative' })).toBeVisible();
      
      // Attempt to save with empty fields
      await page.getByRole('button', { name: 'Save' }).click();

      // Verify validation messages
      await expect(page.getByText('Initiative name is required')).toBeVisible();
      await expect(page.getByText('Description is required')).toBeVisible();
    });
  });

  test.describe('Manage Budget Envelope', () => {
    const department = 'B0010-Ethics Office';
    const totalAmount = '$70,000.00';

    test('should allow creating and editing a budget envelope', async ({ page }) => {
      await page.goto('/manage-budget-envelope');

      // Create
      await page.getByRole('button', { name: 'Manage Budget Envelope' }).click();
      await expect(page.getByRole('heading', { name: 'New Budget Envelope' })).toBeVisible();
      
      await page.getByLabel('Department').click();
      await page.getByRole('option', { name: department }).click();
      
      await page.getByLabel('2026').fill('10000');
      await page.getByLabel('2027').fill('15000');
      await page.getByLabel('2028').fill('20000');
      await page.getByLabel('2029').fill('25000');
      await page.getByRole('button', { name: 'Save Budget Envelope' }).click();

      // Verify creation
      await expect(page.getByRole('cell', { name: department })).toBeVisible();
      await expect(page.getByRole('cell', { name: totalAmount })).toBeVisible();

      // Edit
      await page.getByRole('row', { name: department }).getByRole('button').click();
      await page.getByRole('menuitem', { name: 'Edit' }).click();
      await expect(page.getByRole('heading', { name: 'Edit Budget Envelope' })).toBeVisible();
      await page.getByLabel('2026').fill('11000');
      await page.getByRole('button', { name: 'Save Budget Envelope' }).click();

      // Verify edit
      await expect(page.getByRole('cell', { name: '$71,000.00' })).toBeVisible();
    });

    test('should show errors for empty fields on budget envelope creation', async ({ page }) => {
      await page.goto('/manage-budget-envelope');

      await page.getByRole('button', { name: 'Manage Budget Envelope' }).click();
      await expect(page.getByRole('heading', { name: 'New Budget Envelope' })).toBeVisible();

      await page.getByRole('button', { name: 'Save Budget Envelope' }).click();

      await expect(page.getByText('Department is required')).toBeVisible();
      await expect(page.getByText('Amount is required').first()).toBeVisible();
    });
  });
});
