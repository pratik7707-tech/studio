
import { test, expect } from '@playwright/test';
import * as docx from 'docx';
import * as fs from 'fs';
import * as path from 'path';

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

    test('Positive: should allow creating, editing, and deleting a standard initiative', async ({ page }) => {
      await page.goto('/manage-standard-initiatives');
      await page.waitForLoadState('networkidle');

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

    test('Negative: should show errors for empty fields on standard initiative creation', async ({ page }) => {
      await page.goto('/manage-standard-initiatives');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: 'New Standard Initiative Plan' }).click();
      await expect(page.getByRole('heading', { name: 'New Standard Initiative' })).toBeVisible();
      
      // Attempt to save with empty fields
      await page.getByRole('button', { name: 'Save' }).click();

      // Verify validation messages
      await expect(page.getByText('Initiative name is required')).toBeVisible();
      await expect(page.getByText('Description is required')).toBeVisible();
    });

    test('Negative: should show errors for exceeding character limits on standard initiative', async ({ page }) => {
      await page.goto('/manage-standard-initiatives');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: 'New Standard Initiative Plan' }).click();
      await expect(page.getByRole('heading', { name: 'New Standard Initiative' })).toBeVisible();

      await page.getByLabel('Standard Initiative Name').fill('a'.repeat(41));
      await page.getByLabel('Description').fill('a'.repeat(501));
      
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByText('Short Name must be 40 characters or less')).toBeVisible();
      await expect(page.getByText('Description must be 500 characters or less')).toBeVisible();
    });
  });

  test.describe('Manage Budget Envelope', () => {
    const department = 'B0010-Ethics Office';
    const totalAmount = '$70,000.00';

    test('Positive: should allow creating and editing a budget envelope', async ({ page }) => {
      await page.goto('/manage-budget-envelope');
      await page.waitForLoadState('networkidle');

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

    test('Negative: should show errors for empty fields on budget envelope creation', async ({ page }) => {
      await page.goto('/manage-budget-envelope');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: 'Manage Budget Envelope' }).click();
      await expect(page.getByRole('heading', { name: 'New Budget Envelope' })).toBeVisible();

      await page.getByRole('button', { name: 'Save Budget Envelope' }).click();

      await expect(page.getByText('Department is required')).toBeVisible();
      await expect(page.getByText('Amount is required').first()).toBeVisible();
    });
  });

  test.describe('Proposal Narrative', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const moreOptionsButton = page.getByRole('button', { name: 'More options' });
        if (await moreOptionsButton.isVisible()) {
          await moreOptionsButton.click();
          const deleteButton = page.getByRole('button', { name: 'Delete' });
          if (await deleteButton.isVisible()) {
              await deleteButton.click();
              await page.getByRole('button', { name: 'Delete' }).click();
          } else {
              await page.keyboard.press('Escape');
          }
        }
        await expect(page.getByText('To begin, please create your first Context, Challenges & Opportunities')).toBeVisible();
    });

    test('Positive: should allow manually adding, editing, and deleting a narrative', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Manually' }).click();
        await page.getByLabel('Context').fill('Test Context');
        await page.getByLabel('Challenge').fill('Test Challenge');
        await page.getByLabel('Opportunity').fill('Test Opportunity');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Test Context')).toBeVisible();
        await expect(page.getByText('Test Challenge')).toBeVisible();
        await expect(page.getByText('Test Opportunity')).toBeVisible();

        await page.getByRole('button', { name: 'More options' }).click();
        await page.getByRole('menuitem', { name: 'Edit' }).click();
        await page.getByLabel('Context').fill('Updated Test Context');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Updated Test Context')).toBeVisible();

        await page.getByRole('button', { name: 'More options' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByText('To begin, please create your first Context, Challenges & Opportunities')).toBeVisible();
    });

    test('Positive: should upload a DOCX file and populate the narrative', async ({ page }) => {
        const testDocPath = path.join(__dirname, 'test-narrative.docx');
        const doc = new docx.Document({
          sections: [{
            children: [
              new docx.Paragraph({ text: "Context", heading: docx.HeadingLevel.HEADING_1 }),
              new docx.Paragraph({ text: "This is the context from the document." }),
              new docx.Paragraph({ text: "Challenges", heading: docx.HeadingLevel.HEADING_1 }),
              new docx.Paragraph({ text: "These are the challenges from the document." }),
              new docx.Paragraph({ text: "Opportunities", heading: docx.HeadingLevel.HEADING_1 }),
              new docx.Paragraph({ text: "These are the opportunities from the document." }),
            ],
          }],
        });
        const buffer = await docx.Packer.toBuffer(doc);
        fs.writeFileSync(testDocPath, buffer);
    
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'Upload DOCX' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(testDocPath);

        await expect(page.getByText('This is the context from the document.')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('These are the challenges from the document.')).toBeVisible();
        await expect(page.getByText('These are the opportunities from the document.')).toBeVisible();

        // Clean up the created file
        fs.unlinkSync(testDocPath);
    });
    
    test('Negative: should handle partially filled narrative form', async ({ page }) => {
        await page.getByRole('button', { name: 'Add Manually' }).click();
        await page.getByLabel('Context').fill('Only Context Provided');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Only Context Provided')).toBeVisible();
        await expect(page.getByText('No challenges identified.')).toBeVisible();
        await expect(page.getByText('No opportunities identified.')).toBeVisible();
    });
  });


  test.describe('Operating Budget', () => {
    const initiativeName = `Custom Initiative ${Date.now()}`;

    test('Positive: should add a new custom initiative', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Operating Budget' }).click();
      
      await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
      await page.getByRole('button', { name: 'Create' }).click();
      await page.getByRole('menuitem', { name: 'New Initiative' }).click();
      
      await page.getByLabel('Enter Short Name*').fill(initiativeName);
      await page.getByLabel('Enter Long Name*').fill('This is a longer name for the custom initiative');
      await page.getByLabel('Select Department*').click();
      await page.getByRole('option', { name: 'B0001-Executive Office' }).click();
      await page.getByLabel('Enter Initiative Rationale*').fill('Test rationale');
      await page.getByLabel('Enter risk of not implementing the initiative*').fill('Test risk');
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText(initiativeName)).toBeVisible();

      await page.locator('.group').filter({ hasText: initiativeName }).getByRole('button').nth(0).click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
    });
    
    test('Negative: should show errors for empty fields on custom initiative creation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Operating Budget' }).click();

      await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
      await page.getByRole('button', { name: 'Create' }).click();
      await page.getByRole('menuitem', { name: 'New Initiative' }).click();
      
      await page.getByRole('button', { name: 'Save' }).click();
      
      await expect(page.getByText('Short Name is required')).toBeVisible();
      await expect(page.getByText('Long Name is required')).toBeVisible();
      await expect(page.getByText('Department is required')).toBeVisible();
      await expect(page.getByText('Rationale is required')).toBeVisible();
      await expect(page.getByText('Risk is required')).toBeVisible();
    });

    test('Negative: should show errors for exceeding character limits on custom initiative', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Operating Budget' }).click();
    
      await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
      await page.getByRole('button', { name: 'Create' }).click();
      await page.getByRole('menuitem', { name: 'New Initiative' }).click();
    
      const longString = 'a'.repeat(501);
      await page.getByLabel('Enter Rationale*').fill(longString);
      await page.getByLabel('Enter Short Name*').fill('a'.repeat(41));

      await page.getByRole('button', { name: 'Save' }).click();
    
      await expect(page.getByText('Rationale must be 500 characters or less')).toBeVisible();
      await expect(page.getByText('Short Name must be 40 characters or less')).toBeVisible();
    });

    test('Positive: should add a standard initiative', async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('/manage-standard-initiatives');
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('table')).toBeVisible();

        await page.getByRole('button', { name: 'New Standard Initiative Plan' }).click();
        await page.getByLabel('Standard Initiative Name').fill('A Standard Initiative for Testing');
        await page.getByLabel('Description').fill('Standard Desc');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('A Standard Initiative for Testing')).toBeVisible();
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await page.getByRole('tab', { name: 'Operating Budget' }).click();
        await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
        await page.getByRole('button', { name: 'Create' }).click();
        await page.getByRole('menuitem', { name: 'Select Standard Initiatives' }).click();

        await page.getByLabel('Select Department').click();
        await page.getByRole('option', { name: 'B0010-Ethics Office' }).click();
        await page.getByLabel('Select a Standard Initiative').click();
        await page.getByRole('option', { name: 'A Standard Initiative for Testing' }).click();
        await page.getByLabel('Enter Initiative Rationale').fill('Rationale for standard');
        await page.getByLabel('Enter risk of not implementing the initiative').fill('Risk for standard');
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('A Standard Initiative for Testing')).toBeVisible();
    });
  });

  test.describe('Position Budget', () => {
    test('Positive: should create a new position', async ({ page }) => {
        const positionTitle = `Test Position ${Date.now()}`;
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.getByRole('tab', { name: 'Position Budget' }).click();

        await expect(page.getByRole('button', { name: 'New Position' })).toBeVisible();
        await page.getByRole('button', { name: 'New Position' }).click();
        
        await expect(page.getByRole('heading', { name: 'New Position' })).toBeVisible();
        
        await page.getByLabel('Select Department').click();
        await page.getByRole('option', { name: 'B0002-Corp HQ - Management and Admin' }).click();
        
        await page.getByLabel('Location').click();
        await page.getByRole('option', { name: 'USA' }).click();

        await page.getByLabel('Select Grade').click();
        await page.getByRole('option', { name: 'USG' }).click();

        await page.getByLabel('Position Number').fill('12345');
        await page.getByLabel('Position title').fill(positionTitle);

        await page.getByLabel('Start Month/Year').click();
        await page.getByRole('button', { name: 'Go to next month' }).click();
        await page.getByRole('gridcell', { name: '15' }).first().click();

        await page.getByLabel('End Month/Year').click();
        await page.getByRole('button', { name: 'Go to next year' }).click();
        await page.getByRole('gridcell', { name: '20' }).first().click();

        await page.getByLabel('Enter Justification').fill('This is a justification for the new test position.');

        await page.getByRole('button', { name: 'Add Source' }).click();
        await page.getByLabel('Funding Source').click();
        await page.getByRole('option', { name: 'Source 1' }).click();
        await page.getByPlaceholder('%').first().fill('100');
        await page.getByPlaceholder('%').nth(1).fill('100');
        await page.getByPlaceholder('%').nth(2).fill('100');
        await page.getByPlaceholder('%').nth(3).fill('100');

        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByRole('cell', { name: positionTitle })).toBeVisible();
    });

    test('Negative: should show errors for empty fields on new position', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.getByRole('tab', { name: 'Position Budget' }).click();

        await expect(page.getByRole('button', { name: 'New Position' })).toBeVisible();
        await page.getByRole('button', { name: 'New Position' }).click();
        await expect(page.getByRole('heading', { name: 'New Position' })).toBeVisible();

        await page.getByRole('button', { name: 'Save' }).click();
        
        await expect(page.getByText('Please select Department.')).toBeVisible();
        await expect(page.getByText('Please select Location.')).toBeVisible();
        await expect(page.getByText('Please select a grade type and grade')).toBeVisible();
        await expect(page.getByText('Position Number is required')).toBeVisible();
        await expect(page.getByText('Position title is required')).toBeVisible();
        await expect(page.getByText('Start Month/Year is required.')).toBeVisible();
        await expect(page.getByText('End Month/Year is required.')).toBeVisible();
        await expect(page.getByText('Justification is required')).toBeVisible();
        await expect(page.getByText('At least one funding source is required.')).toBeVisible();
    });

    test('Negative: should show error for invalid funding distribution', async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.getByRole('tab', { name: 'Position Budget' }).click();
        await expect(page.getByRole('button', { name: 'New Position' })).toBeVisible();
        await page.getByRole('button', { name: 'New Position' }).click();
        
        await page.getByLabel('Select Department').click();
        await page.getByRole('option', { name: 'B0002-Corp HQ - Management and Admin' }).click();
        await page.getByLabel('Location').click();
        await page.getByRole('option', { name: 'USA' }).click();
        await page.getByLabel('Select Grade').click();
        await page.getByRole('option', { name: 'USG' }).click();
        await page.getByLabel('Position Number').fill('54321');
        await page.getByLabel('Position title').fill('Bad Funding Test');
        await page.getByLabel('Start Month/Year').click();
        await page.getByRole('button', { name: 'Go to next month' }).click();
        await page.getByRole('gridcell', { name: '15' }).first().click();
        await page.getByLabel('End Month/Year').click();
        await page.getByRole('button', { name: 'Go to next year' }).click();
        await page.getByRole('gridcell', { name: '20' }).first().click();
        await page.getByLabel('Enter Justification').fill('Justification');

        await page.getByRole('button', { name: 'Add Source' }).click();
        await page.getByLabel('Funding Source').click();
        await page.getByRole('option', { name: 'Source 1' }).click();
        await page.getByPlaceholder('%').first().fill('50');
        
        await page.getByRole('button', { name: 'Save' }).click();
        
        await expect(page.getByText('Percentage must be 100% for each year with funding.')).toBeVisible();
    });

    test('Negative: should not allow letters in position number field', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.getByRole('tab', { name: 'Position Budget' }).click();
  
      await page.getByRole('button', { name: 'New Position' }).click();
      
      const positionNumberInput = page.getByLabel('Position Number');
      await positionNumberInput.fill('abc');
      
      await expect(positionNumberInput).toHaveValue('abc');
    });
  });
});
