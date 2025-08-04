
export interface BudgetItem {
  id: string;
  type: 'operating' | 'position';
  shortName: string;
  longName: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High';
  rationale: string;
  risk: string;
  amount: number;
}

export interface NarrativeData {
  id: string;
  Context: string;
  Challenges: string;
  Opportunities: string;
  updatedAt?: string;
}
