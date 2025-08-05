
'use client';

import type { BudgetItem, StandardInitiative } from "@/lib/types";
import { OperatingBudgetTable } from "./operating-budget-table";
import { useToast } from "@/hooks/use-toast";
import type { InitiativeFormData } from "./create-initiative-sheet";
import type { StandardInitiativeFormData } from "./select-standard-initiative-sheet";

interface OperatingBudgetProps {
    data: BudgetItem[];
    standardInitiatives: StandardInitiative[];
    isLoading: boolean;
    onUpdate: () => void;
}

export function OperatingBudget({ data, standardInitiatives, isLoading, onUpdate }: OperatingBudgetProps) {
    const { toast } = useToast();

    const handleAddItem = async (newItem: InitiativeFormData) => {
        const budgetItem: Omit<BudgetItem, 'id' | 'type'> = {
            ...newItem,
            amount: 0,
            isStandard: false,
        };

        try {
            const response = await fetch('/api/operating-budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetItem),
            });
            const result = await response.json();
            if (result.success) {
                onUpdate();
                toast({ title: "Success!", description: "Initiative added successfully." });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save initiative.' });
        }
    };

    const handleAddStandardItem = async (newItem: StandardInitiativeFormData) => {
        const budgetItem: Omit<BudgetItem, 'id' | 'type'> = {
            ...newItem,
            shortName: newItem.standardInitiative,
            longName: newItem.standardInitiative,
            amount: 0,
            isStandard: true,
        };

        try {
            const response = await fetch('/api/operating-budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetItem),
            });
            const result = await response.json();
            if (result.success) {
                onUpdate();
                toast({ title: "Success!", description: "Standard initiative added successfully." });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save initiative.' });
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            const response = await fetch(`/api/operating-budgets?id=${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
                onUpdate();
                toast({ title: "Success!", description: "Item deleted successfully." });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete item.' });
        }
    };

    const handleUpdateItem = async (id: string, field: keyof BudgetItem, value: string | number) => {
        const updatedItem = { id, [field]: value };
        try {
            const response = await fetch('/api/operating-budgets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            });
            const result = await response.json();
            if (result.success) {
                onUpdate();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update item.' });
        }
    };

    const handleSaveItem = async (id: string, formData: InitiativeFormData) => {
        const updatedData = { id, ...formData };
        try {
            const response = await fetch('/api/operating-budgets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            const result = await response.json();
            if (result.success) {
                onUpdate();
                toast({ title: "Success!", description: "Initiative saved successfully." });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save initiative.' });
        }
    };

    return (
        <OperatingBudgetTable
            title="Operating Budget"
            data={data}
            standardInitiatives={standardInitiatives}
            onAddItem={handleAddItem}
            onAddStandardItem={handleAddStandardItem}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
            onSaveItem={handleSaveItem}
            isLoading={isLoading}
        />
    );
}
