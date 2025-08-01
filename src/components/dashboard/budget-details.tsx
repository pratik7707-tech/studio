'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BudgetTable } from './budget-table';
import type { BudgetItem } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';

interface BudgetDetailsProps {
  operatingBudget: BudgetItem[];
  setOperatingBudget: Dispatch<SetStateAction<BudgetItem[]>>;
  positionBudget: BudgetItem[];
  setPositionBudget: Dispatch<SetStateAction<BudgetItem[]>>;
}

export function BudgetDetails({ operatingBudget, setOperatingBudget, positionBudget, setPositionBudget }: BudgetDetailsProps) {
  return (
    <Tabs defaultValue="operating">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="narrative">Proposal Narrative</TabsTrigger>
        <TabsTrigger value="operating">Operating Budget</TabsTrigger>
        <TabsTrigger value="position">Position Budget</TabsTrigger>
      </TabsList>
      <TabsContent value="narrative">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Proposal Narrative</CardTitle>
            <CardDescription>Provide a detailed description of the project proposal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter proposal narrative here..."
              className="min-h-[300px]"
              defaultValue="This project aims to optimize budget allocation through the use of generative AI, analyzing historical data and current challenges to provide actionable insights. The core objective is to enhance financial efficiency and strategic resource deployment across corporate headquarters for the 2026-29 fiscal period."
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="operating">
        <BudgetTable title="Operating Budget" data={operatingBudget} setData={setOperatingBudget} />
      </TabsContent>
      <TabsContent value="position">
        <BudgetTable title="Position Budget" data={positionBudget} setData={setPositionBudget} />
      </TabsContent>
    </Tabs>
  );
}
