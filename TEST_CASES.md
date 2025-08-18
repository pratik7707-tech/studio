# Application Test Cases

This document outlines the test cases for the BudgetWise application's key features.

---

## 1. Proposal Narrative

### 1.1. Initial State
- **Test Case 1.1.1:** Verify that when no narrative data exists, the "Add Manually" and "Upload DOCX" buttons are displayed.
- **Test Case 1.1.2:** Verify that the placeholder text "To begin, please create your first Context, Challenges & Opportunities" is visible.

### 1.2. Manual Data Entry
- **Test Case 1.2.1:** Click "Add Manually" to open the "Add Narrative" form.
- **Test Case 1.2.2:** Verify that the form contains text areas for "Context", "Challenges", and "Opportunities".
- **Test Case 1.2.3:** Fill in all fields and click "Save". Verify that the form closes and the entered text is displayed correctly in the main view.
- **Test Case 1.2.4:** Verify that a success toast notification appears after saving.
- **Test Case 1.2.5:** Try to close the form after making changes without saving. Verify that a confirmation dialog appears asking to confirm discarding changes.

### 1.3. DOCX Upload
- **Test Case 1.3.1:** Click "Upload DOCX" and select a valid `.docx` file with "Context:", "Challenges:", and "Opportunities:" headings.
- **Test Case 1.3.2:** Verify that the content is parsed and displayed correctly in their respective sections.
- **Test Case 1.3.3:** Verify that a success toast notification appears.
- **Test Case 1.3.4:** Attempt to upload a file that is not a `.docx`. Verify that an error toast appears.

### 1.4. Editing and Deleting
- **Test Case 1.4.1:** Once data is present, verify the "More" options menu (three dots) is visible.
- **Test Case 1.4.2:** Click "Edit" from the dropdown. Verify the "Edit Narrative" form opens with the existing data pre-filled.
- **Test Case 1.4.3:** Modify the text and save. Verify the changes are reflected in the main view.
- **Test Case 1.4.4:** Click "Delete" from the dropdown. Verify a confirmation dialog appears.
- **Test Case 1.4.5:** Confirm deletion. Verify that all narrative data is cleared and the initial empty state is shown.

---

## 2. Operating Budget

### 2.1. Initial State
- **Test Case 2.1.1:** Verify the table shows a loading state initially.
- **Test Case 2.1.2:** If no items exist, verify the "No data available" message is displayed.

### 2.2. Create New Initiative
- **Test Case 2.2.1:** Click the "Create" button and select "New Initiative".
- **Test Case 2.2.2:** Verify the "Create New Initiative" form opens.
- **Test Case 2.2.3:** Verify that all required fields have an asterisk (*) and that form validation works (e.g., trying to save with empty required fields shows an error).
- **Test Case 2.2.4:** Fill out the form and click "Save". Verify the form closes and the new initiative appears in the table with an amount of $0.00.
- **Test Case 2.2.5:** Verify a success toast appears.

### 2.3. Select Standard Initiative
- **Test Case 2.3.1:** Click the "Create" button and select "Select Standard Initiatives".
- **Test Case 2.3.2:** Verify that the "Select Standard Initiative" dropdown contains the initiatives created in the "Manage Standard Initiatives" section.
- **Test Case 2.3.3:** Select an initiative, fill out the remaining fields, and save.
- **Test Case 2.3.4:** Verify the new item appears in the table, marked with an "SI" badge.

### 2.4. Edit and Delete Initiative
- **Test Case 2.4.1:** Click the "More" options menu on an initiative item and select "Edit".
- **Test Case 2.4.2:** Verify the "Edit Initiative" form opens with the correct data.
- **Test Case 2.4.3:** Change a value (e.g., the priority) and save. Verify the change is reflected in the item's collapsed and expanded views.
- **Test Case 2.4.4:** Update the "Amount" field for an item. Verify the value is saved and a success toast appears.
- **Test Case 2.4.5:** Click "Delete" from the "More" menu and confirm. Verify the item is removed from the table.

---

## 3. Position Budget

### 3.1. Create New Position
- **Test Case 3.1.1:** Navigate to the "Position Budget" tab and click "New Position".
- **Test Case 3.1.2:** Verify the "New Position" form opens.
- **Test Case 3.1.3:** Test form validation, including required fields, the end date being after the start date, and funding source percentages summing to 100% for each year.
- **Test Case 3.1.4:** Add multiple funding sources.
- **Test Case 3.1.5:** Fill out the form correctly and save. Verify the new position appears in the "Proposed Changes" table.
- **Test Case 3.1.6:** Verify the new position has a "NEW" badge.

### 3.2. Table Functionality
- **Test Case 3.2.1:** Verify that the tabs "Baseline", "Proposed Changes", and "Final Positions" are present.
- **Test Case 3.2.2:** Verify that the "Proposed Changes" tab is active by default.
- **Test Case 3.2.3:** Verify that filtering and searching controls are present.

---

## 4. Manage Standard Initiatives

### 4.1. Create, Edit, Delete
- **Test Case 4.1.1:** Navigate to the page via Admin -> Manage Standard Initiative.
- **Test Case 4.1.2:** Click "New Standard Initiative Plan". Fill out the form and save. Verify a full-screen loader appears during save.
- **Test Case 4.1.3:** Verify the new initiative appears in the table.
- **Test Case 4.1.4:** Click "Edit" on the new initiative. Change the description and save. Verify the change is reflected in the table.
- **Test Case 4.1.5:** Click "Delete" on the initiative. Confirm the deletion in the dialog.
- **Test Case 4.1.6:** Verify the initiative is removed from the table.

### 4.2. Pagination
- **Test Case 4.2.1:** Verify the pagination controls are displayed at the bottom of the table.
- **Test Case 4.2.2:** Verify the current page is highlighted with the primary blue color.
- **Test Case 4.2.3:** Verify the "Records per page" dropdown works as expected.
- **Test Case 4.2.4:** Verify clicking on a page number changes the active page.

---

## 5. Manage Budget Envelope

### 5.1. Create, Edit, Delete
- **Test Case 5.1.1:** Navigate to the page via Admin -> Manage Budget Envelope.
- **Test Case 5.1.2:** Click "Manage Budget Envelope". Fill out the form and save.
- **Test Case 5.1.3:** Verify the new envelope appears in the table with the correct yearly amounts and total.
- **Test Case 5.1.4:** Click "Edit" on the new envelope. Change an amount and save. Verify the change is reflected in the table.
- **Test Case 5.1.5:** Click "Delete" on the envelope. Confirm the deletion in the dialog.
- **Test Case 5.1.6:** Verify the envelope is removed from the table.

### 5.2. Chart View
- **Test Case 5.2.1:** Click the "View Chart" button.
- **Test Case 5.2.2:** Verify a dialog appears with a bar chart.
- **Test Case 5.2.3:** Verify the chart shows the correct total budget for each year (2026-2029).

---

## 6. General & Navigation

### 6.1. Header and Navigation
- **Test Case 6.1.1:** Verify the "Admin" link in the header is highlighted when on the "Manage Standard Initiatives" or "Manage Budget Envelope" pages.
- **Test Case 6.1.2:** Verify clicking the "Integrated Budget" link navigates back to the main dashboard page.

### 6.2. Loading States
- **Test Case 6.2.1:** Verify that navigating between the "Integrated Budget" page and the "Manage Standard Initiatives" page displays a full-screen shimmer loader.
- **Test Case 6.2.2:** Verify that a full-screen spinner overlay appears when saving a new standard initiative.
