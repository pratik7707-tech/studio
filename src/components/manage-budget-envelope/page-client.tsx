
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { BudgetEnvelope } from '@/lib/types';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnvelopesTable } from './envelopes-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { CreateEnvelopeDialog, type EnvelopeFormData } from './create-envelope-dialog';


export function ManageBudgetEnvelopeClient() {
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchEnvelopes = async () => {
    try {
      const res = await fetch('/api/budget-envelopes');
      const result = await res.json();
      if (result.success) {
        setEnvelopes(result.data);
      } else {
        toast({ variant: 'destructive', title: 'Error loading budget envelopes', description: result.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to connect to the server.' });
    }
  }

  useEffect(() => {
    async function loadEnvelopes() {
      setIsLoading(true);
      await fetchEnvelopes();
      setIsLoading(false);
    }
    loadEnvelopes();
  }, [toast]);

  const totalAmount = useMemo(() => {
    return envelopes.reduce((sum, item) => sum + item.totalAmount, 0);
  }, [envelopes]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSave = async (formData: EnvelopeFormData) => {
    setIsSaving(true);
    try {
      const totalAmount = formData.y2026 + formData.y2027 + formData.y2028 + formData.y2029;
      const dataToSave = { ...formData, totalAmount };

      const response = await fetch('/api/budget-envelopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();
      if (result.success) {
        await fetchEnvelopes();
        toast({ title: 'Success!', description: 'Budget envelope saved successfully.' });
        setIsDialogOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save budget envelope.' });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-2">
              <div>
                  <h1 className="text-2xl font-bold font-headline">Manage Budget Envelope</h1>
                  <p className="text-muted-foreground font-semibold">Total Amount: {formatCurrency(totalAmount)}</p>
              </div>
              <div className="flex items-center gap-4">
                  <Select defaultValue="2026-29">
                      <SelectTrigger className="w-[180px] bg-white">
                          <SelectValue placeholder="Budget Year" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="2026-29">Budget 2026-29</SelectItem>
                      </SelectContent>
                  </Select>
                  <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Manage Budget Envelope
                  </Button>
              </div>
          </div>
          
          <div className="mt-6">
              <EnvelopesTable data={envelopes} isLoading={isLoading} />
              <div className="flex justify-end items-center gap-4 mt-4">
                  <span className="text-sm text-muted-foreground">Records per page:</span>
                  <Select defaultValue="10">
                      <SelectTrigger className="w-20 bg-white">
                      <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white" disabled>{"<<"}</Button>
                      <Button variant="default" size="icon" className="h-8 w-8">1</Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white">2</Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white">{">>"}</Button>
                  </div>
              </div>
          </div>
        </main>
      </div>
      <CreateEnvelopeDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
}
