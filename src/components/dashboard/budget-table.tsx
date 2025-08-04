'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BudgetItem } from "@/lib/types";
import { type Dispatch, type SetStateAction, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Plus, TriangleAlert, Filter } from "lucide-react";
import { CreateInitiativeSheet } from "./create-initiative-sheet";
import { InitiativeItem } from "./initiative-item";

interface BudgetTableProps {
  title: string;
  data: BudgetItem[];
  setData: Dispatch<SetStateAction<BudgetItem[]>>;
}

export function BudgetTable({ title, data, setData }: BudgetTableProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddItem = (newItem: Omit<BudgetItem, 'id'>) => {
    setData([
      ...data,
      { id: `new-${Date.now()}`, ...newItem },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      <Card className="shadow-none border-none">
        <CardHeader className="p-0 mb-4">
          <div className="flex items-center justify-between">
              <CardTitle className="font-headline text-lg">{title} Initiatives</CardTitle>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                        New Initiative
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Select Standard Initiatives
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Total Amount: {formatCurrency(totalAmount)}</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {data.length > 0 ? (
              data.map((item) => (
                <InitiativeItem 
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdateItem}
                    onRemove={handleRemoveItem}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <TriangleAlert className="h-5 w-5 text-yellow-500" />
                      No data available
                  </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <CreateInitiativeSheet 
          isOpen={isSheetOpen}
          setIsOpen={setIsSheetOpen}
          onSave={(formData) => {
              handleAddItem({
                  ...formData,
                  amount: 0, 
              });
              setIsSheetOpen(false);
          }}
      />
    </>
  );
}
