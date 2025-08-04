'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, TriangleAlert, Filter } from "lucide-react";
import type { BudgetItem } from "@/lib/types";
import type { Dispatch, SetStateAction } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetTableProps {
  title: string;
  data: BudgetItem[];
  setData: Dispatch<SetStateAction<BudgetItem[]>>;
}

export function BudgetTable({ title, data, setData }: BudgetTableProps) {
  const handleAddItem = () => {
    setData([
      ...data,
      { id: `new-${Date.now()}`, category: '', item: '', amount: 0 },
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
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
            </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Total Amount: {formatCurrency(totalAmount)}</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            {data.length > 0 && (
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="w-[150px] text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.item}
                        onChange={(e) => handleUpdateItem(item.id, 'item', e.target.value)}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleUpdateItem(item.id, 'amount', Number(e.target.value))}
                        className="h-8 text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <TriangleAlert className="h-5 w-5 text-yellow-500" />
                        No data available
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {data.length > 0 && (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2} className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(totalAmount)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
