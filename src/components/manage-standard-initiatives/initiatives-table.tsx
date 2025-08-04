
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, Loader2 } from "lucide-react";
import type { StandardInitiative } from "@/lib/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

interface InitiativesTableProps {
  data: StandardInitiative[];
  isLoading: boolean;
}

const departmentMap: { [key: string]: string } = {
    'B0002': 'B0002-Corp HQ - Management and Admin',
    'B0001': 'B0001-Executive Office',
    'B0010': 'B0010-Ethics Office',
    'B2107': 'B2107 - Supply Chain Management Unit',
};

export function InitiativesTable({ data, isLoading }: InitiativesTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Short Name</TableHead>
            <TableHead>Long Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Rationale</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{item.shortName}</TableCell>
                <TableCell>{item.longName}</TableCell>
                <TableCell>{departmentMap[item.department] || item.department}</TableCell>
                <TableCell className="max-w-xs truncate">{item.rationale}</TableCell>
                <TableCell className="max-w-xs truncate">{item.risk}</TableCell>
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
                No standard initiatives found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
