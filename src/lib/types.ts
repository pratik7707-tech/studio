export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  amount: number;
}

export interface ContextItem {
  id: string;
  text: string;
}

export interface NarrativeData {
  id?: string;
  context?: string;
  challenge?: string;
  opportunity?: string;
}
