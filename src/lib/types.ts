
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
  createdAt?: any;
  updatedAt?: any;

  // Position-specific fields
  positionId?: string;
  grade?: string;
  location?: string;
  positionTitle?: string;
  justification?: string;
  variance?: number;
  effectiveDate?: string;
  fundingSources?: {
    source: string;
    '2026'?: number;
    '2027'?: number;
    '2028'?: number;
    '2029'?: number;
  }[];
}

export interface NarrativeData {
  id: string;
  Context: string;
  Challenges: string;
  Opportunities: string;
  updatedAt?: string;
  fileName?: string;
}

export interface StandardInitiative {
    id: string;
    shortName: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BudgetEnvelope {
  id: string;
  department: string;
  y2026: number;
  y2027: number;
  y2028: number;
  y2029: number;
  totalAmount: number;
}
