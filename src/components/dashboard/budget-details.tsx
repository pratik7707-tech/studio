'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BudgetTable } from './budget-table';
import type { BudgetItem, ContextItem } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';
import { FileText, Building2, UserCheck, MoreVertical, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";


interface BudgetDetailsProps {
  operatingBudget: BudgetItem[];
  setOperatingBudget: Dispatch<SetStateAction<BudgetItem[]>>;
  positionBudget: BudgetItem[];
  setPositionBudget: Dispatch<SetStateAction<BudgetItem[]>>;
  context: ContextItem[];
  challenges: ContextItem[];
  opportunities: ContextItem[];
}

export function BudgetDetails({ 
  operatingBudget, setOperatingBudget, 
  positionBudget, setPositionBudget,
  context, challenges, opportunities
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
        <Card className="shadow-none border-none">
          <CardContent className="p-0 space-y-6">
            <Textarea
              placeholder="Enter proposal narrative here..."
              className="min-h-[150px]"
              defaultValue="This project aims to optimize budget allocation through the use of generative AI, analyzing historical data and current challenges to provide actionable insights. The core objective is to enhance financial efficiency and strategic resource deployment across corporate headquarters for the 2026-29 fiscal period."
            />
            <Card>
                <CardHeader className='flex flex-row justify-between items-center'>
                    <CardTitle>Context, Challenges & Opportunities</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div>
                        <h3 className='font-semibold text-gray-700'>Context</h3>
                        <p className='text-muted-foreground text-sm'>{context.map(c => c.text).join(' ')}</p>
                    </div>
                     <div>
                        <h3 className='font-semibold text-gray-700'>Challenges</h3>
                        <p className='text-muted-foreground text-sm'>{challenges.length > 0 ? challenges.map(c => c.text).join(' ') : 'No challenges identified.'}</p>
                    </div>
                     <div>
                        <h3 className='font-semibold text-gray-700'>Opportunities</h3>
                        <p className='text-muted-foreground text-sm'>{opportunities.length > 0 ? opportunities.map(c => c.text).join(' ') : 'No opportunities identified.'}</p>
                    </div>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
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
