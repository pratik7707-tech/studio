'use server';

/**
 * @fileOverview A budget improvement suggestion AI agent.
 *
 * - suggestBudgetImprovements - A function that suggests budget improvements based on historical data and identified challenges.
 * - SuggestBudgetImprovementsInput - The input type for the suggestBudgetImprovements function.
 * - SuggestBudgetImprovementsOutput - The return type for the suggestBudgetImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBudgetImprovementsInputSchema = z.object({
  historicalData: z
    .string()
    .describe('Historical budget allocation data in CSV format.'),
  identifiedChallenges: z
    .string()
    .describe('Identified challenges and opportunities related to the budget.'),
  currentBudget: z.string().describe('The current budget allocation.'),
});
export type SuggestBudgetImprovementsInput = z.infer<typeof SuggestBudgetImprovementsInputSchema>;

const SuggestBudgetImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of suggested budget improvements with clear reasoning for each suggestion.'
    ),
});
export type SuggestBudgetImprovementsOutput = z.infer<typeof SuggestBudgetImprovementsOutputSchema>;

export async function suggestBudgetImprovements(
  input: SuggestBudgetImprovementsInput
): Promise<SuggestBudgetImprovementsOutput> {
  return suggestBudgetImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBudgetImprovementsPrompt',
  input: {schema: SuggestBudgetImprovementsInputSchema},
  output: {schema: SuggestBudgetImprovementsOutputSchema},
  prompt: `You are a budget optimization expert. Analyze the historical budget data, identified challenges, and current budget allocation to suggest improvements.

Historical Data: {{{historicalData}}}

Identified Challenges and Opportunities: {{{identifiedChallenges}}}

Current Budget Allocation: {{{currentBudget}}}

Provide a list of suggested budget improvements with clear reasoning for each suggestion. Focus on optimizing budget allocation based on the provided information.
`,
});

const suggestBudgetImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestBudgetImprovementsFlow',
    inputSchema: SuggestBudgetImprovementsInputSchema,
    outputSchema: SuggestBudgetImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
