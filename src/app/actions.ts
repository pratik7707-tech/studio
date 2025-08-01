'use server';

import { suggestBudgetImprovements } from '@/ai/flows/suggest-budget-improvements';
import type { BudgetItem, ContextItem } from '@/lib/types';

function formatBudgetDataToCSV(data: BudgetItem[]): string {
  const header = 'Category,Item,Amount\n';
  const rows = data.map(d => `${d.category},${d.item},${d.amount}`);
  return header + rows.join('\n');
}

function formatContextItems(items: ContextItem[]): string {
  return items.map(item => `- ${item.text}`).join('\n');
}

export async function getAiSuggestionsAction(
  operatingBudget: BudgetItem[],
  positionBudget: BudgetItem[],
  challenges: ContextItem[],
  opportunities: ContextItem[]
) {
  try {
    const historicalData = 'N/A for this version. Use current budget as baseline.';
    const currentBudget = `Operating Budget:\n${formatBudgetDataToCSV(operatingBudget)}\n\nPosition Budget:\n${formatBudgetDataToCSV(positionBudget)}`;
    const identifiedChallenges = `Challenges:\n${formatContextItems(challenges)}\n\nOpportunities:\n${formatContextItems(opportunities)}`;

    const result = await suggestBudgetImprovements({
      historicalData,
      identifiedChallenges,
      currentBudget,
    });
    
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get AI suggestions.' };
  }
}
