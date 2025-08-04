
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { BudgetItem } from '@/lib/types';
import { Header } from './header';
import { MetricCard } from './metric-card';
import { BudgetDetails } from './budget-details';
import { Wallet, Coins, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InitiativeFormData } from './create-initiative-sheet';

export function BudgetPageClient() {
  const [operatingBudget, setOperatingBudget] = useState<BudgetItem[]>([]);
  const [positionBudget, setPositionBudget] = useState<BudgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadBudgets() {
      setIsLoading(true);
      try {
        const [opRes, posRes] = await Promise.all([
          fetch('/api/budgets?type=operating'),
          fetch('/api/budgets?type=position'),
        ]);

        const opResult = await opRes.json();
        if (opResult.success) {
          setOperatingBudget(opResult.data);
        } else {
          toast({ variant: 'destructive', title: 'Error loading operating budget', description: opResult.error });
        }

        const posResult = await posRes.json();
        if (posResult.success) {
          setPositionBudget(posResult.data);
        } else {
          toast({ variant: 'destructive', title: 'Error loading position budget', description: posResult.error });
        }

      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to connect to the server.' });
      } finally {
        setIsLoading(false);
      }
    }
    loadBudgets();
  }, [toast]);

  const totalOperatingBudget = useMemo(() => operatingBudget.reduce((sum, item) => sum + item.amount, 0), [operatingBudget]);
  const totalPositionBudget = useMemo(() => positionBudget.reduce((sum, item) => sum + item.amount, 0), [positionBudget]);
  const totalBudget = totalOperatingBudget + totalPositionBudget;
  const totalEnvelope = 72270140.00;

  const formatCurrency = (amount: number, withCents = true) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: withCents ? 2 : 0,
      maximumFractionDigits: withCents ? 2 : 0,
    }).format(amount);
  };

  const handleAddItem = async (newItem: InitiativeFormData, type: 'operating' | 'position') => {
    const budgetItem: Omit<BudgetItem, 'id'> = {
      ...newItem,
      type,
      amount: 0,
    };

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetItem),
      });
      const result = await response.json();
      if (result.success) {
        const fullItem = { ...budgetItem, id: result.data.id };
        if (type === 'operating') {
          setOperatingBudget(prev => [...prev, fullItem]);
        } else {
          setPositionBudget(prev => [...prev, fullItem]);
        }
        toast({ title: "Success!", description: "Initiative added successfully." });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save initiative.' });
    }
  };

  const handleRemoveItem = async (id: string, type: 'operating' | 'position') => {
    try {
      const response = await fetch(`/api/budgets?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        if (type === 'operating') {
          setOperatingBudget(prev => prev.filter(item => item.id !== id));
        } else {
          setPositionBudget(prev => prev.filter(item => item.id !== id));
        }
        toast({ title: "Success!", description: "Initiative deleted successfully." });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete initiative.' });
    }
  };

  const handleUpdateItem = async (id: string, field: keyof BudgetItem, value: string | number, type: 'operating' | 'position') => {
     const updatedItem = { id, [field]: value };
    try {
        const response = await fetch('/api/budgets', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem),
        });
        const result = await response.json();
        if (result.success) {
            const updater = (item: BudgetItem) => item.id === id ? { ...item, [field]: value } : item;
            if (type === 'operating') {
                setOperatingBudget(prev => prev.map(updater));
            } else {
                setPositionBudget(prev => prev.map(updater));
            }
            // Do not toast on every keystroke, only on explicit save actions.
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update initiative.' });
    }
  };

  const handleSaveItem = async (id: string, formData: InitiativeFormData, type: 'operating' | 'position') => {
    const updatedData = { id, ...formData };
    try {
        const response = await fetch('/api/budgets', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        const result = await response.json();
        if (result.success) {
            const updater = (item: BudgetItem) => item.id === id ? { ...item, ...formData } : item;
             if (type === 'operating') {
                setOperatingBudget(prev => prev.map(updater));
            } else {
                setPositionBudget(prev => prev.map(updater));
            }
            toast({ title: "Success!", description: "Initiative saved successfully." });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save initiative.' });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <MetricCard 
            title="Total Budget vs Total Envelope" 
            value={`${formatCurrency(totalBudget)} / ${formatCurrency(totalEnvelope)}`} 
            icon={Wallet} 
            valueClassName="text-xl"
            />
          <MetricCard title="Total Institutional Budget" value={formatCurrency(52951220.77)} icon={Coins} />
          <MetricCard title="Total GRP Budget" value={formatCurrency(5000000.00)} icon={Users} />
        </div>
        
        <div className="grid grid-cols-1">
          <div>
            <BudgetDetails
              operatingBudget={operatingBudget}
              positionBudget={positionBudget}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
              onSaveItem={handleSaveItem}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
