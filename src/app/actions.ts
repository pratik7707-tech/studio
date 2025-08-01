'use server';

import { suggestBudgetImprovements } from '@/ai/flows/suggest-budget-improvements';
import type { BudgetItem, ContextItem } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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

export async function saveNarrativeItem(item: {
  id?: string;
  text: string;
  type: 'Context' | 'Challenge' | 'Opportunity';
}) {
  try {
    if (item.id) {
      // Update existing document
      const docRef = doc(db, 'narratives', item.id);
      await updateDoc(docRef, {
        text: item.text,
        type: item.type,
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: item.id };
    } else {
      // Add new document
      const docRef = await addDoc(collection(db, 'narratives'), {
        text: item.text,
        type: item.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error('Error saving document: ', error);
    return { success: false, error: 'Failed to save data to Firestore.' };
  }
}

export async function deleteNarrativeItem(id: string) {
  try {
    await deleteDoc(doc(db, "narratives", id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return { success: false, error: "Failed to delete item from Firestore." };
  }
}