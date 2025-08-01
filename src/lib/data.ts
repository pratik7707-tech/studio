import type { BudgetItem, ContextItem } from './types';

export const initialOperatingBudget: BudgetItem[] = [
  { id: 'op1', category: 'Personnel', item: 'Salaries and Wages', amount: 1250000 },
  { id: 'op2', category: 'Personnel', item: 'Fringe Benefits', amount: 375000 },
  { id: 'op3', category: 'Travel', item: 'Domestic Travel', amount: 50000 },
  { id: 'op4', category: 'Supplies', item: 'Office Supplies', amount: 25000 },
  { id: 'op5', category: 'Contractual', item: 'Consulting Services', amount: 150000 },
];

export const initialPositionBudget: BudgetItem[] = [
  { id: 'pos1', category: 'Management', item: 'Project Director', amount: 150000 },
  { id: 'pos2', category: 'Technical Staff', item: 'Senior Developer', amount: 120000 },
  { id: 'pos3', category: 'Technical Staff', item: 'UX/UI Designer', amount: 95000 },
  { id: 'pos4', category: 'Admin', item: 'Project Coordinator', amount: 65000 },
];

export const initialContext: ContextItem[] = [
  { id: 'ctx1', text: 'Multi-year grant from the National Science Foundation.' },
  { id: 'ctx2', text: 'Project timeline is 36 months.' },
  { id: 'ctx3', text: 'Collaboration with two partner universities.' },
];

export const initialChallenges: ContextItem[] = [
  { id: 'ch1', text: 'Recruitment for specialized technical roles is competitive.' },
  { id: 'ch2', text: 'Potential for increased cloud computing costs.' },
];

export const initialOpportunities: ContextItem[] = [
  { id: 'op1', text: 'Leverage open-source software to reduce licensing fees.' },
  { id: 'op2', text: 'Explore remote work options to widen talent pool.' },
];
