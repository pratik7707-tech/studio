'use client';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { ContextItem } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import { ContextForm } from './context-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveNarrativeItem, deleteNarrativeItem, getNarrativeItems } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '../ui/skeleton';

interface NarrativeSectionProps {
  title: string;
  items: ContextItem[];
  placeholder: string;
}

const NarrativeSection = ({ title, items, placeholder }: NarrativeSectionProps) => (
    <div className="mb-4">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => (
            <p key={item.id} className="text-sm text-muted-foreground">{item.text}</p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">{placeholder}</p>
      )}
    </div>
  );


interface ProposalNarrativeProps {
  context: ContextItem[];
  setContext: Dispatch<SetStateAction<ContextItem[]>>;
  challenges: ContextItem[];
  setChallenges: Dispatch<SetStateAction<ContextItem[]>>;
  opportunities: ContextItem[];
  setOpportunities: Dispatch<SetStateAction<ContextItem[]>>;
}

export function ProposalNarrative({
  context,
  setContext,
  challenges,
  setChallenges,
  opportunities,
  setOpportunities,
}: ProposalNarrativeProps) {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const result = await getNarrativeItems();
      if (result.success && result.data) {
        setContext(result.data.filter(d => d.type === 'Context'));
        setChallenges(result.data.filter(d => d.type === 'Challenge'));
        setOpportunities(result.data.filter(d => d.type === 'Opportunity'));
      } else if (!result.success) {
        toast({ variant: 'destructive', title: 'Error loading data', description: result.error });
      }
      setIsLoading(false);
    }
    loadData();
  }, [setContext, setChallenges, setOpportunities, toast]);

  const handleEdit = () => {
    setFormOpen(true);
  };

  const handleDeleteAll = async () => {
    const allItems = [...context, ...challenges, ...opportunities];
    if (allItems.length === 0) {
      toast({ title: 'Nothing to delete' });
      return;
    }
  
    let hadError = false;
    for (const item of allItems) {
      if (!item.id) continue;
      const result = await deleteNarrativeItem(item.id);
      if (!result.success) {
        hadError = true;
        toast({ variant: 'destructive', title: 'Error', description: `Failed to delete ${item.type}: ${item.text}` });
      }
    }
  
    if (!hadError) {
      setContext([]);
      setChallenges([]);
      setOpportunities([]);
      toast({ title: 'Success!', description: 'All narrative items have been deleted.' });
    }
  };
  

  const handleSave = async (data: { [key: string]: string | undefined }) => {
    setIsSaving(true);

    // First, delete all existing items
    const allCurrentItems = [...context, ...challenges, ...opportunities];
    for (const item of allCurrentItems) {
        if (item.id) await deleteNarrativeItem(item.id);
    }
  
    try {
        const itemsToSave: { text: string, type: 'Context' | 'Challenge' | 'Opportunity' }[] = [];
        if (data.context && data.context.trim()) itemsToSave.push({ text: data.context, type: 'Context' });
        if (data.challenge && data.challenge.trim()) itemsToSave.push({ text: data.challenge, type: 'Challenge' });
        if (data.opportunity && data.opportunity.trim()) itemsToSave.push({ text: data.opportunity, type: 'Opportunity' });
  
        if (itemsToSave.length === 0) {
            setContext([]);
            setChallenges([]);
            setOpportunities([]);
            toast({ title: 'Narrative cleared', description: 'All fields were empty.' });
        } else {
            let hadError = false;
            const newContext: ContextItem[] = [];
            const newChallenges: ContextItem[] = [];
            const newOpportunities: ContextItem[] = [];

            for (const item of itemsToSave) {
              const result = await saveNarrativeItem(item);
              if (result.success && result.id) {
                const newItem: ContextItem = { ...item, id: result.id };
                if (item.type === 'Context') newContext.push(newItem);
                if (item.type === 'Challenge') newChallenges.push(newItem);
                if (item.type === 'Opportunity') newOpportunities.push(newItem);
              } else {
                hadError = true;
                toast({ variant: 'destructive', title: 'Error', description: `Failed to save ${item.type}: ${result.error}` });
              }
            }
            if (!hadError) {
              setContext(newContext);
              setChallenges(newChallenges);
              setOpportunities(newOpportunities);
              toast({ title: 'Success!', description: 'Your narrative has been saved.' });
              setFormOpen(false);
            }
        }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message || 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>
             <Skeleton className="h-6 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <Skeleton className="h-4 w-1/4" />
           <Skeleton className="h-4 w-3/4" />
           <Skeleton className="h-4 w-1/4" />
           <Skeleton className="h-4 w-3/4" />
           <Skeleton className="h-4 w-1/4" />
           <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const noData = context.length === 0 && challenges.length === 0 && opportunities.length === 0;

  if (noData) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
        <p className="mb-4 text-muted-foreground">To begin, please create your first Context, Challenges &amp; Opportunities</p>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Context, Challenges &amp; Opportunities
        </Button>
        <ContextForm
          isOpen={isFormOpen}
          setIsOpen={setFormOpen}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={{context, challenges, opportunities}}
        />
      </div>
    );
  }

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Context, Challenges &amp; Opportunities
        </CardTitle>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all narrative items.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
          <NarrativeSection
            title="Context"
            items={context}
            placeholder="No context identified."
          />
          <NarrativeSection
            title="Challenges"
            items={challenges}
            placeholder="No challenges identified."
          />
          <NarrativeSection
            title="Opportunities"
            items={opportunities}
            placeholder="No opportunities identified."
          />
      </CardContent>
      <ContextForm
        isOpen={isFormOpen}
        setIsOpen={setFormOpen}
        onSave={handleSave}
        isSaving={isSaving}
        initialData={{context, challenges, opportunities}}
      />
    </Card>
  );
}
