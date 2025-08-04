
'use client';

import { useState, useEffect } from 'react';
import type { StandardInitiative } from '@/lib/types';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InitiativesTable } from './initiatives-table';

export function ManageStandardInitiativesClient() {
  const [initiatives, setInitiatives] = useState<StandardInitiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // useEffect(() => {
  //   async function loadInitiatives() {
  //     setIsLoading(true);
  //     try {
  //       // Replace with your actual API endpoint for standard initiatives
  //       const res = await fetch('/api/standard-initiatives');
  //       const result = await res.json();
  //       if (result.success) {
  //         setInitiatives(result.data);
  //       } else {
  //         toast({ variant: 'destructive', title: 'Error loading initiatives', description: result.error });
  //       }
  //     } catch (error) {
  //       toast({ variant: 'destructive', title: 'Error', description: 'Failed to connect to the server.' });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   loadInitiatives();
  // }, [toast]);

  // Mock loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleCreate = () => {
    // Logic to open a creation form/sheet
    console.log('Create new standard initiative');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-headline">Manage Standard Initiative</h1>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <InitiativesTable data={initiatives} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
