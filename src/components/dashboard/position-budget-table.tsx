
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Filter, Loader2, Plus, Search, Settings } from "lucide-react";
import type { BudgetItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CreatePositionSheet, PositionFormData } from "./create-position-sheet";

interface PositionBudgetTableProps {
  data: BudgetItem[];
  isLoading: boolean;
}

const departmentMap: { [key: string]: string } = {
  'B0002': 'B0002-Corp HQ - Management and Admin',
  'B0001': 'B0001-Executive Office',
  'B0010': 'B0010-Ethics Office',
  'B2107': 'B2107-Supply Chain Management Unit',
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const exampleData = [
  {
      id: '1',
      department: 'B0002',
      positionId: '123456',
      grade: 'P-5',
      location: 'New York',
      positionTitle: 'Snr. Management Advisor',
      justification: 'Lorem ipsum dolor sit',
      amount: 100000.00,
      variance: 2000.00,
      effectiveDate: '01/01/2026',
      type: 'position' as 'position',
      shortName: '',
      longName: '',
      priority: 'Medium' as 'Medium',
      rationale: '',
      risk: '',
  },
  {
      id: '2',
      department: 'B0002',
      positionId: '123457',
      grade: 'G-7',
      location: 'New York',
      positionTitle: 'Programme Associate',
      justification: 'Lorem ipsum dolor sit',
      amount: 80000.00,
      variance: undefined,
      effectiveDate: undefined,
      type: 'position' as 'position',
      shortName: '',
      longName: '',
      priority: 'Medium' as 'Medium',
      rationale: '',
      risk: '',
  },
];


export function PositionBudgetTable({ data, isLoading }: PositionBudgetTableProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSave = (formData: PositionFormData) => {
    console.log(formData);
    // TODO: Connect to backend to save data
    setIsSheetOpen(false);
  }

  return (
    <div>
      <Tabs defaultValue="proposed">
        <div className="flex justify-between items-start mb-4">
            <TabsList className="bg-transparent p-0">
                <TabsTrigger value="baseline" className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">Baseline</TabsTrigger>
                <TabsTrigger value="proposed" className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">Proposed Changes</TabsTrigger>
                <TabsTrigger value="final" className="pb-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent">Final Positions</TabsTrigger>
            </TabsList>
             <div className="flex items-center gap-2">
                   <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      All
                  </Button>
                  <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                      </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                  </div>
              </div>
        </div>
        <TabsContent value="baseline">
           <div className="border rounded-lg">
              {/* Baseline content will go here */}
              <p className="p-4 text-center text-muted-foreground">Baseline position data is not yet available.</p>
           </div>
        </TabsContent>
        <TabsContent value="proposed">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsSheetOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Position
                </Button>
            </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Position ID</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Position Title</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : (
                  exampleData.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium flex items-center gap-1">
                        {departmentMap[item.department] || item.department}
                        {item.department === 'Saving from Posts' && <ArrowUpRight className="h-4 w-4" />}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        {item.positionId}
                        {item.positionId && <ArrowUpRight className="h-4 w-4" />}
                      </TableCell>
                      <TableCell>{item.grade}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.positionTitle}</TableCell>
                      <TableCell>{item.justification}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell>{item.variance ? formatCurrency(item.variance) : ''}</TableCell>
                      <TableCell>{item.effectiveDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           {item.variance && <Badge variant="secondary" className="bg-gray-200 text-gray-800">NEW</Badge>}
                           {item.variance && <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
           <div className="flex justify-end items-center gap-4 mt-4">
              <span className="text-sm text-muted-foreground">Records per page:</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>{"<<"}</Button>
                <Button variant="outline" size="sm" className="bg-gray-200">1</Button>
                <Button variant="outline" size="sm" disabled>{">>"}</Button>
              </div>
            </div>
        </TabsContent>
         <TabsContent value="final">
           <div className="border rounded-lg">
                {/* Final positions content will go here */}
              <p className="p-4 text-center text-muted-foreground">Final position data is not yet available.</p>
           </div>
        </TabsContent>
      </Tabs>
      <CreatePositionSheet 
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        onSave={handleSave}
      />
    </div>
  )
}
