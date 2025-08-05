
'use client';

import { useState, useEffect } from 'react';
import type { StandardInitiative } from '@/lib/types';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InitiativesTable } from './initiatives-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CreateInitiativeSheet, type InitiativeFormData } from './create-initiative-sheet';

export function ManageStandardInitiativesClient() {
  const [initiatives, setInitiatives] = useState<StandardInitiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadInitiatives() {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await fetch('/api/standard-initiatives');
        const result = await res.json();
        if (result.success) {
          setInitiatives(result.data);
        } else {
          toast({ variant: 'destructive', title: 'Error loading initiatives', description: result.error });
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to connect to the server.' });
      } finally {
        setIsLoading(false);
      }
    }
    loadInitiatives();
  }, [toast]);

  const handleCreate = () => {
    setIsSheetOpen(true);
  };
  
  const handleSave = async (formData: InitiativeFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/standard-initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setInitiatives(prev => [...prev, result.data]);
        toast({ title: 'Success!', description: 'Standard initiative saved successfully.' });
        setIsSheetOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save initiative.' });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-headline">Manage Standard Initiatives</h1>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Standard Initiative Plan
            </Button>
          </div>
          <Card className="bg-white p-4 rounded-lg border">
              <CardHeader>
                  <CardTitle className="text-lg font-semibold">Standard Initiatives</CardTitle>
              </CardHeader>
              <CardContent>
                  <InitiativesTable data={initiatives} isLoading={isLoading} />
                  <div className="flex justify-end items-center gap-4 mt-4">
                      <span className="text-sm text-muted-foreground">Records per page:</span>
                      <Select defaultValue="10">
                          <SelectTrigger className="w-20">
                          <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" disabled>{"<<"}</Button>
                          <Button variant="default" size="icon" className="h-8 w-8">1</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">2</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">3</Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">{">>"}</Button>
                      </div>
                  </div>
              </CardContent>
          </Card>
        </main>
        <CreateInitiativeSheet
          isOpen={isSheetOpen}
          setIsOpen={setIsSheetOpen}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Saving Initiative...</p>
          </div>
        </div>
      )}
    </>
  );
}
