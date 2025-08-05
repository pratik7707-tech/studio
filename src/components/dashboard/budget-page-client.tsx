
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { BudgetItem, StandardInitiative } from '@/lib/types';
import { Header } from './header';
import { MetricCard } from './metric-card';
import { BudgetDetails } from './budget-details';
import { Wallet, Coins, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BudgetPageClient() {
  const [operatingBudget, setOperatingBudget] = useState<BudgetItem[]>([]);
  const [positionBudget, setPositionBudget] = useState<BudgetItem[]>([]);
  const [standardInitiatives, setStandardInitiatives] = useState<StandardInitiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOperatingBudget = useCallback(async () => {
    const opRes = await fetch('/api/operating-budgets');
    const opResult = await opRes.json();
    if (opResult.success) {
      setOperatingBudget(opResult.data);
    } else {
      toast({ variant: 'destructive', title: 'Error loading operating budget', description: opResult.error });
    }
  }, [toast]);

  const fetchPositionBudget = useCallback(async () => {
    const posRes = await fetch('/api/positions');
    const posResult = await posRes.json();
    if (posResult.success) {
      setPositionBudget(posResult.data);
    } else {
      toast({ variant: 'destructive', title: 'Error loading position budget', description: posResult.error });
    }
  }, [toast]);

  const fetchStandardInitiatives = useCallback(async () => {
    const stdRes = await fetch('/api/standard-initiatives');
    const stdResult = await stdRes.json();
    if (stdResult.success) {
      setStandardInitiatives(stdResult.data);
    } else {
        toast({ variant: 'destructive', title: 'Error loading standard initiatives', description: stdResult.error });
    }
  }, [toast]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await Promise.all([
          fetchOperatingBudget(),
          fetchPositionBudget(),
          fetchStandardInitiatives(),
        ]);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to connect to the server.' });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast, fetchOperatingBudget, fetchPositionBudget, fetchStandardInitiatives]);

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
              standardInitiatives={standardInitiatives}
              onOperatingBudgetUpdate={fetchOperatingBudget}
              onPositionBudgetUpdate={fetchPositionBudget}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
