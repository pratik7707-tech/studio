
'use client';
import { useState } from 'react';
import type { BudgetItem } from '@/lib/types';
import { PositionBudgetTable } from './position-budget-table';
import type { PositionFormData } from './create-position-sheet';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PositionBudgetProps {
    data: BudgetItem[];
    isLoading: boolean;
    onUpdate: () => void;
}

export function PositionBudget({ data, isLoading, onUpdate }: PositionBudgetProps) {
    const { toast } = useToast();

    const handleSavePosition = async (formData: PositionFormData) => {
        const budgetItem: Omit<BudgetItem, 'id' | 'type'> = {
          shortName: formData.positionTitle,
          longName: formData.positionTitle,
          department: formData.department,
          priority: 'Medium',
          rationale: '',
          risk: '',
          amount: 428997.00, // TODO: This should be calculated
          isStandard: false,
    
          // Position-specific fields
          positionId: formData.positionNumber,
          grade: formData.grade,
          location: formData.location,
          positionTitle: formData.positionTitle,
          justification: formData.justification,
          variance: 428997.00, // TODO: this should be calculated
          effectiveDate: format(formData.startDate, 'MMM yyyy'),
          fundingSources: formData.fundingSources,
        };
    
        try {
          const response = await fetch('/api/positions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetItem),
          });
          const result = await response.json();
          if (result.success) {
            onUpdate();
            toast({ title: "Success!", description: "Position added successfully." });
          } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
          }
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to save position.' });
        }
      };

    return (
        <PositionBudgetTable
            data={data}
            isLoading={isLoading}
            onSavePosition={handleSavePosition}
        />
    );
}
