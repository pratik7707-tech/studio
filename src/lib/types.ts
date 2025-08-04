
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
  isStandard?: boolean;

  // Position-specific fields
  positionId?: string;
  grade?: string;
  location?: string;
  positionTitle?: string;
  justification?: string;
  variance?: number;
  effectiveDate?: string;
}

export interface NarrativeData {
  id: string;
  Context: string;
  Challenges: string;
  Opportunities: string;
  updatedAt?: string;
}
