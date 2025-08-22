
import { test, expect } from '@playwright/test';

// A test asset we can reuse for creation and updates
const testInitiative = {
    shortName: `API Test Initiative ${Date.now()}`,
    description: 'This was created by an API test.',
};

let createdInitiativeId = '';

test.describe('API Endpoint Tests', () => {

  test('GET /api/operating-budgets should return success and data', async ({ request }) => {
    const response = await request.get('/api/operating-budgets');
    await expect(response).toBeOK();
    const json = await response.json();
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('data');
    expect(Array.isArray(json.data)).toBe(true);
  });

  test('GET /api/positions should return success and data', async ({ request }) => {
    const response = await request.get('/api/positions');
    await expect(response).toBeOK();
    const json = await response.json();
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('data');
    expect(Array.isArray(json.data)).toBe(true);
  });

  test('GET /api/budget-envelopes should return success and data', async ({ request }) => {
    const response = await request.get('/api/budget-envelopes');
    await expect(response).toBeOK();
    const json = await response.json();
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('data');
    expect(Array.isArray(json.data)).toBe(true);
  });

  test('GET /api/narrative should return success and data', async ({ request }) => {
    const response = await request.get('/api/narrative');
    await expect(response).toBeOK();
    const json = await response.json();
    expect(json).toHaveProperty('success', true);
    expect(json).toHaveProperty('data');
    expect(typeof json.data).toBe('object');
  });

  test.describe('CRUD Operations for Standard Initiatives', () => {

    test('POST /api/standard-initiatives should create a new item', async ({ request }) => {
      const response = await request.post('/api/standard-initiatives', {
        data: testInitiative,
      });
      await expect(response).toBeOK();
      const json = await response.json();
      expect(json).toHaveProperty('success', true);
      expect(json.data).toHaveProperty('id');
      expect(json.data.shortName).toBe(testInitiative.shortName);

      // Store the ID for subsequent tests
      createdInitiativeId = json.data.id;
    });

    test('PUT /api/standard-initiatives should update an existing item', async ({ request }) => {
        expect(createdInitiativeId, 'Create test must run first and set an ID').not.toBe('');
        const updatedDescription = 'This description has been updated via API.';
        
        const response = await request.put('/api/standard-initiatives', {
            data: {
                id: createdInitiativeId,
                description: updatedDescription,
            },
        });
        await expect(response).toBeOK();
        const json = await response.json();
        expect(json).toHaveProperty('success', true);
        
        // Optional: Verify the update with a subsequent GET request
        const getResponse = await request.get('/api/standard-initiatives');
        const getJson = await getResponse.json();
        const updatedItem = getJson.data.find((item: any) => item.id === createdInitiativeId);
        expect(updatedItem.description).toBe(updatedDescription);
    });

    test('DELETE /api/standard-initiatives should remove the item', async ({ request }) => {
        expect(createdInitiativeId, 'Create test must run first and set an ID').not.toBe('');
        
        const response = await request.delete(`/api/standard-initiatives?id=${createdInitiativeId}`);
        await expect(response).toBeOK();
        const json = await response.json();
        expect(json).toHaveProperty('success', true);

        // Optional: Verify deletion
        const getResponse = await request.get('/api/standard-initiatives');
        const getJson = await getResponse.json();
        const deletedItem = getJson.data.find((item: any) => item.id === createdInitiativeId);
        expect(deletedItem).toBeUndefined();
    });
  });
});
