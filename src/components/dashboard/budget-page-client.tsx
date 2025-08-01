'use client';

import { useState, useMemo } from 'react';
import type { BudgetItem, ContextItem } from '@/lib/types';
import { initialOperatingBudget, initialPositionBudget, initialContext, initialChallenges, initialOpportunities } from '@/lib/data';
import { Header } from './header';
import { MetricCard } from './metric-card';
import { BudgetDetails } from './budget-details';
import { getAiSuggestionsAction } from '@/app/actions';
import { AiSuggestionDialog } from './ai-suggestion-dialog';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Coins, Users, Lightbulb, AlertTriangle, CheckCircle, FileText, Building2, UserCheck, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function BudgetPageClient() {
  const [operatingBudget, setOperatingBudget] = useState<BudgetItem[]>(initialOperatingBudget);
  const [positionBudget, setPositionBudget] = useState<BudgetItem[]>(initialPositionBudget);
  const [context, setContext] = useState<ContextItem[]>(initialContext);
  const [challenges, setChallenges] = useState<ContextItem[]>(initialChallenges);
  const [opportunities, setOpportunities] = useState<ContextItem[]>(initialOpportunities);

  const [aiSuggestions, setAiSuggestions] = useState('');
  const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const { toast } = useToast();

  const handleGetAiSuggestions = async () => {
    setSuggestionModalOpen(true);
    setIsLoadingSuggestions(true);
    setAiSuggestions('');
    
    const result = await getAiSuggestionsAction(
      operatingBudget,
      positionBudget,
      challenges,
      opportunities
    );

    setIsLoadingSuggestions(false);
    if (result.success) {
      setAiSuggestions(result.suggestions);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setSuggestionModalOpen(false);
    }
  };

  const totalOperatingBudget = useMemo(() => operatingBudget.reduce((sum, item) => sum + item.amount, 0), [operatingBudget]);
  const totalPositionBudget = useMemo(() => positionBudget.reduce((sum, item) => sum + item.amount, 0), [positionBudget]);
  const totalBudget = 52951220.77 + 5000000;
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
            <BudgetDetails
              operatingBudget={operatingBudget}
              setOperatingBudget={setOperatingBudget}
              positionBudget={positionBudget}
              setPositionBudget={setPositionBudget}
              context={context}
              challenges={challenges}
              opportunities={opportunities}
            />
        </div>
      </main>

      <AiSuggestionDialog
        open={isSuggestionModalOpen}
        setOpen={setSuggestionModalOpen}
        isLoading={isLoadingSuggestions}
        suggestions={aiSuggestions}
      />
    </div>
  );
}
