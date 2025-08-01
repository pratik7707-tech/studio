'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetTable } from './budget-table';
import type { BudgetItem, ContextItem } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';
import { FileText, Building2, UserCheck } from "lucide-react";
import { ProposalNarrative } from "./proposal-narrative";


interface BudgetDetailsProps {
  operatingBudget: BudgetItem[];
  setOperatingBudget: Dispatch<SetStateAction<BudgetItem[]>>;
  positionBudget: BudgetItem[];
  setPositionBudget: Dispatch<SetStateAction<BudgetItem[]>>;
  context: ContextItem[];
  setContext: Dispatch<SetStateAction<ContextItem[]>>;
  challenges: ContextItem[];
  setChallenges: Dispatch<SetStateAction<ContextItem[]>>;
  opportunities: ContextItem[];
  setOpportunities: Dispatch<SetStateAction<ContextItem[]>>;
}

export function BudgetDetails({ 
  operatingBudget, setOperatingBudget, 
  positionBudget, setPositionBudget,
  context, setContext,
  challenges, setChallenges,
  opportunities, setOpportunities
}: BudgetDetailsProps) {
  return (
    <Tabs defaultValue="narrative" className="bg-white rounded-lg border p-4">
      <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
        <TabsTrigger value="narrative" className="flex gap-2 justify-start data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">
          <FileText className="h-5 w-5" /> Proposal Narrative
        </TabsTrigger>
        <TabsTrigger value="operating" className="flex gap-2 justify-start data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">
          <Building2 className="h-5 w-5" /> Operating Budget
        </TabsTrigger>
        <TabsTrigger value="position" className="flex gap-2 justify-start data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">
          <UserCheck className="h-5 w-5" /> Position Budget
        </TabsTrigger>
      </TabsList>
      <TabsContent value="narrative" className="mt-4">
        <ProposalNarrative
          context={context}
          setContext={setContext}
          challenges={challenges}
          setChallenges={setChallenges}
          opportunities={opportunities}
          setOpportunities={setOpportunities}
        />
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
