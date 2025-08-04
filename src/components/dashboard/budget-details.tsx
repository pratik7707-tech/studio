
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetTable } from './budget-table';
import type { BudgetItem } from '@/lib/types';
import { FileText, Users } from "lucide-react";
import { ProposalNarrative } from "./proposal-narrative";
import type { InitiativeFormData } from "./create-initiative-sheet";
import type { StandardInitiativeFormData } from "./select-standard-initiative-sheet";


interface BudgetDetailsProps {
  operatingBudget: BudgetItem[];
  positionBudget: BudgetItem[];
  onAddItem: (newItem: InitiativeFormData, type: 'operating' | 'position') => void;
  onAddStandardItem: (newItem: StandardInitiativeFormData, type: 'operating' | 'position') => void;
  onRemoveItem: (id: string, type: 'operating' | 'position') => void;
  onUpdateItem: (id: string, field: keyof BudgetItem, value: string | number, type: 'operating' | 'position') => void;
  onSaveItem: (id: string, formData: InitiativeFormData, type: 'operating' | 'position') => void;
  isLoading: boolean;
}

const OperatingBudgetIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M12 8c-2.209 0-4 0.895-4 2s1.791 2 4 2 4-0.895 4-2-1.791-2-4-2z"></path>
      <path d="M12 8V6"></path>
      <path d="M12 14v-2"></path>
      <path d="M12 12c-2.209 0-4 0.895-4 2s1.791 2 4 2 4-0.895 4-2-1.791-2-4-2z"></path>
      <path d="M12 14V12"></path>
      <path d="M12 18v-2"></path>
      <path d="M12 16c-2.209 0-4 0.895-4 2s1.791 2 4 2 4-0.895 4-2-1.791-2-4-2z"></path>
      <path d="M12 18V16"></path>
      <ellipse cx="12" cy="6" rx="4" ry="2"></ellipse>
    </svg>
  );

export function BudgetDetails({ 
  operatingBudget,
  positionBudget,
  onAddItem,
  onAddStandardItem,
  onRemoveItem,
  onUpdateItem,
  onSaveItem,
  isLoading,
}: BudgetDetailsProps) {
  return (
    <Tabs defaultValue="narrative" className="bg-white rounded-lg border p-4">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
        <TabsTrigger value="narrative" className="flex gap-2 justify-start data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">
          <FileText className="h-5 w-5" /> Proposal Narrative
        </TabsTrigger>
        <TabsTrigger value="operating" className="flex gap-2 justify-start data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">
          <OperatingBudgetIcon /> Operating Budget
        </TabsTrigger>
        <TabsTrigger value="position" className="flex gap-2 justify-start data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">
          <Users className="h-5 w-5" /> Position Budget
        </TabsTrigger>
      </TabsList>
      <TabsContent value="narrative" className="mt-4">
        <ProposalNarrative />
      </TabsContent>
      <TabsContent value="operating" className="mt-4">
        <BudgetTable 
          type="operating"
          title="Operating Budget" 
          data={operatingBudget}
          onAddItem={onAddItem}
          onAddStandardItem={onAddStandardItem}
          onRemoveItem={onRemoveItem}
          onUpdateItem={onUpdateItem}
          onSaveItem={onSaveItem}
          isLoading={isLoading}
        />
      </TabsContent>
      <TabsContent value="position" className="mt-4">
        <BudgetTable
          type="position"
          title="Position Budget"
          data={positionBudget}
          onAddItem={onAddItem}
          onAddStandardItem={onAddStandardItem}
          onRemoveItem={onRemoveItem}
          onUpdateItem={onUpdateItem}
          onSaveItem={onSaveItem}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
