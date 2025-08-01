export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  amount: number;
}

export interface NarrativeData {
  id: string;
  context: string;
  challenge: string;
  opportunity: string;
  updatedAt?: string;
}
