'use client';

import { useState, useMemo } from 'react';
import type { BudgetItem } from '@/lib/types';
import { initialOperatingBudget, initialPositionBudget } from '@/lib/data';
import { Header } from './header';
import { MetricCard } from './metric-card';
import { BudgetDetails } from './budget-details';
import { Wallet, Coins, Users } from 'lucide-react';

export function BudgetPageClient() {
  const [operatingBudget, setOperatingBudget] = useState<BudgetItem[]>(initialOperatingBudget);
  const [positionBudget, setPositionBudget] = useState<BudgetItem[]>(initialPositionBudget);

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
              setOperatingBudget={setOperatingBudget}
              positionBudget={positionBudget}
              setPositionBudget={setPositionBudget}
            />
          </div>
        </div>
      </main>
    </div>
  );
}