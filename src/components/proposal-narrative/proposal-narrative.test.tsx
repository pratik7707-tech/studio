
'use client';

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProposalNarrative } from './proposal-narrative';
import { Toaster } from '@/components/ui/toaster';

// Mock the global fetch function
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe('ProposalNarrative', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockFetch.mockClear();
  });

  test('displays empty state with add and upload buttons when no narrative exists', async () => {
    // Mock the API response for no narrative data
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'narrative_1', Context: '', Challenges: '', Opportunities: '' },
      }),
    } as Response);

    // Render the component and a Toaster to prevent errors from useToast
    render(
      <>
        <ProposalNarrative />
        <Toaster />
      </>
    );

    // Wait for the loading to finish and the component to update
    await waitFor(() => {
      // Check for the placeholder text
      expect(screen.getByText('To begin, please create your first Context, Challenges & Opportunities')).toBeInTheDocument();
    });

    // Check that the buttons are visible
    expect(screen.getByRole('button', { name: /Add Manually/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload DOCX/i })).toBeInTheDocument();
  });
});
