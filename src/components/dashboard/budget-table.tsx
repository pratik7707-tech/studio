
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BudgetItem, StandardInitiative } from "@/lib/types";
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Plus, TriangleAlert, Filter, Loader2 } from "lucide-react";
import { CreateInitiativeSheet, InitiativeFormData } from "./create-initiative-sheet";
import { InitiativeItem } from "./initiative-item";
import { StandardInitiativeFormData, SelectStandardInitiativeSheet } from "./select-standard-initiative-sheet";

interface BudgetTableProps {
  type: 'operating' | 'position';
  title: string;
  data: BudgetItem[];
  standardInitiatives: StandardInitiative[];
  onAddItem: (newItem: InitiativeFormData, type: 'operating' | 'position') => void;
  onAddStandardItem: (newItem: StandardInitiativeFormData, type: 'operating' | 'position') => void;
  onRemoveItem: (id: string, type: 'operating' | 'position') => void;
  onUpdateItem: (id: string, field: keyof BudgetItem, value: string | number, type: 'operating' | 'position') => void;
  onSaveItem: (id: string, formData: InitiativeFormData, type: 'operating' | 'position') => void;
  isLoading: boolean;
}

export function BudgetTable({ 
  type,
  title, 
  data, 
  standardInitiatives,
  onAddItem,
  onAddStandardItem,
  onRemoveItem,
  onUpdateItem,
  onSaveItem,
  isLoading,
}: BudgetTableProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isStandardSheetOpen, setIsStandardSheetOpen] = useState(false);

  const handleCreateNew = (formData: InitiativeFormData) => {
    onAddItem(formData, type);
    setIsSheetOpen(false);
  };
  
  const handleSelectStandard = (formData: StandardInitiativeFormData) => {
    onAddStandardItem(formData, type);
    setIsStandardSheetOpen(false);
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
                      <DropdownMenuItem onClick={() => setIsStandardSheetOpen(true)}>
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p className="text-muted-foreground mt-2">Loading Initiatives...</p>
              </div>
            ) : data.length > 0 ? (
              data.map((item) => (
                <InitiativeItem 
                    key={item.id}
                    item={item}
                    onUpdate={(id, field, value) => onUpdateItem(id, field, value, type)}
                    onRemove={(id) => onRemoveItem(id, type)}
                    onSave={(id, formData) => onSaveItem(id, formData, type)}
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
          onSave={handleCreateNew}
      />
       <SelectStandardInitiativeSheet
        isOpen={isStandardSheetOpen}
        setIsOpen={setIsStandardSheetOpen}
        onSave={handleSelectStandard}
        standardInitiatives={standardInitiatives}
      />
    </>
  );
}
