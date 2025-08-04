'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetTable } from './budget-table';
import type { BudgetItem } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';
import { FileText, Users } from "lucide-react";
import { ProposalNarrative } from "./proposal-narrative";


interface BudgetDetailsProps {
  operatingBudget: BudgetItem[];
  setOperatingBudget: Dispatch<SetStateAction<BudgetItem[]>>;
  positionBudget: BudgetItem[];
  setPositionBudget: Dispatch<SetStateAction<BudgetItem[]>>;
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
  operatingBudget, setOperatingBudget, 
  positionBudget, setPositionBudget,
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
        <BudgetTable title="Operating Budget" data={operatingBudget} setData={setOperatingBudget} />
      </TabsContent>
      <TabsContent value="position" className="mt-4">
        <BudgetTable title="Position Budget" data={positionBudget} setData={setPositionBudget} />
      </TabsContent>
    </Tabs>
  );
}
