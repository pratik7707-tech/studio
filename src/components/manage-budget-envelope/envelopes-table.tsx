
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
import { MoreVertical, Loader2 } from "lucide-react";
import type { BudgetEnvelope } from "@/lib/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnvelopesTableProps {
  data: BudgetEnvelope[];
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
};

export function EnvelopesTable({ data, isLoading }: EnvelopesTableProps) {
  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-foreground">Department</TableHead>
            <TableHead className="text-right font-bold text-foreground">2026</TableHead>
            <TableHead className="text-right font-bold text-foreground">2027</TableHead>
            <TableHead className="text-right font-bold text-foreground">2028</TableHead>
            <TableHead className="text-right font-bold text-foreground">2029</TableHead>
            <TableHead className="text-right font-bold text-foreground">Total Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.department}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.y2026)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.y2027)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.y2028)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.y2029)}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(item.totalAmount)}</TableCell>
                <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No budget envelopes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
