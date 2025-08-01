'use client';

import { useState, useMemo } from 'react';
import type { BudgetItem, ContextItem } from '@/lib/types';
import { initialOperatingBudget, initialPositionBudget, initialContext, initialChallenges, initialOpportunities } from '@/lib/data';
import { Header } from './header';
import { MetricCard } from './metric-card';
import { BudgetDetails } from './budget-details';
import { ContextCard } from './context-card';
import { getAiSuggestionsAction } from '@/app/actions';
import { AiSuggestionDialog } from './ai-suggestion-dialog';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Target, Briefcase, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

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
  const totalBudget = totalOperatingBudget + totalPositionBudget;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header onGetAiSuggestions={handleGetAiSuggestions} />

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <MetricCard title="Total Budget vs Total Envelope" value={formatCurrency(totalBudget)} icon={DollarSign} />
          <MetricCard title="Total Institutional Budget" value={formatCurrency(5000000)} description="Target" icon={Target} />
          <MetricCard title="Total GRP Budget" value={formatCurrency(2500000)} description="Allocated" icon={Briefcase} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <BudgetDetails
              operatingBudget={operatingBudget}
              setOperatingBudget={setOperatingBudget}
              positionBudget={positionBudget}
              setPositionBudget={setPositionBudget}
            />
          </div>
          <div className="space-y-6">
            <ContextCard title="Context" items={context} setItems={setContext} icon={Lightbulb} />
            <ContextCard title="Challenges" items={challenges} setItems={setChallenges} icon={AlertTriangle} />
            <ContextCard title="Opportunities" items={opportunities} setItems={setOpportunities} icon={CheckCircle} />
          </div>
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
