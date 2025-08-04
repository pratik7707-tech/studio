export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  amount: number;
}

export interface NarrativeData {
  id: string;
  Context: string;
  Challenges: string;
  Opportunities: string;
  updatedAt?: string;
}
