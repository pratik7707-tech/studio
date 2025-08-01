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
} from "@/components/ui/alert-dialog"
import { Skeleton } from '../ui/skeleton';

interface NarrativeDisplayProps {
  title: string;
  items: ContextItem[];
  onEdit: (item: ContextItem) => void;
  onDelete: (item: ContextItem) => void;
  placeholder: string;
}

const NarrativeDisplay = ({ title, items, onEdit, onDelete, placeholder }: NarrativeDisplayProps) => (
  <div className="mb-4">
    <h3 className="text-md font-semibold mb-2">{title}</h3>
    {items.length > 0 ? (
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between group">
            <p className="text-sm text-muted-foreground">{item.text}</p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(item)}>
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
                          This action cannot be undone. This will permanently delete the item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(item)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
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
  const [editingItem, setEditingItem] = useState<ContextItem | undefined>(undefined);
  const [formType, setFormType] = useState<'Context' | 'Challenge' | 'Opportunity'>('Context');
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

  const handleAdd = (type: 'Context' | 'Challenge' | 'Opportunity') => {
    setEditingItem(undefined);
    setFormType(type);
    setFormOpen(true);
  };

  const handleEdit = (item: ContextItem) => {
    setEditingItem(item);
    setFormType(item.type);
    setFormOpen(true);
  };

  const handleDelete = async (itemToDelete: ContextItem) => {
    const result = await deleteNarrativeItem(itemToDelete.id);
    if (result.success) {
      if (itemToDelete.type === 'Context') {
        setContext(prev => prev.filter(item => item.id !== itemToDelete.id));
      } else if (itemToDelete.type === 'Challenge') {
        setChallenges(prev => prev.filter(item => item.id !== itemToDelete.id));
      } else if (itemToDelete.type === 'Opportunity') {
        setOpportunities(prev => prev.filter(item => item.id !== itemToDelete.id));
      }
      toast({ title: 'Success!', description: 'Item deleted.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleSave = async (data: { [key: string]: string | undefined }) => {
    setIsSaving(true);
  
    const getSetter = (type: 'Context' | 'Challenge' | 'Opportunity') => {
      if (type === 'Context') return setContext;
      if (type === 'Challenge') return setChallenges;
      return setOpportunities;
    };
  
    try {
      if (editingItem) {
        // This is an edit
        const textKey = editingItem.type.toLowerCase();
        const newText = data[textKey];
        if (typeof newText !== 'string' || !newText.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Text cannot be empty.' });
            setIsSaving(false);
            return;
        }

        const itemToSave = { id: editingItem.id, text: newText, type: editingItem.type };
        
        const result = await saveNarrativeItem(itemToSave);
        if (result.success) {
          const setter = getSetter(itemToSave.type);
          setter(prev => prev.map(item => item.id === itemToSave.id ? { ...item, text: itemToSave.text } : item));
          toast({ title: 'Success!', description: 'Your item has been updated.' });
          setFormOpen(false);
          setEditingItem(undefined);
        } else {
          toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
      } else {
        // This is a new item (or items)
        const itemsToSave: { text: string, type: 'Context' | 'Challenge' | 'Opportunity' }[] = [];
        if (data.context) itemsToSave.push({ text: data.context, type: 'Context' });
        if (data.challenge) itemsToSave.push({ text: data.challenge, type: 'Challenge' });
        if (data.opportunity) itemsToSave.push({ text: data.opportunity, type: 'Opportunity' });
  
        if (itemsToSave.length === 0) {
          toast({ title: 'Nothing to save', description: 'All fields were empty.' });
        } else {
            let hadError = false;
            for (const item of itemsToSave) {
              const result = await saveNarrativeItem(item);
              if (result.success && result.id) {
                const setter = getSetter(item.type);
                const newItem = { id: result.id, ...item, createdAt: new Date().toISOString() };
                setter(prev => [...prev, newItem]);
              } else {
                hadError = true;
                toast({ variant: 'destructive', title: 'Error', description: `Failed to save ${item.type}: ${result.error}` });
              }
            }
            if (!hadError) {
              toast({ title: 'Success!', description: 'Your items have been saved.' });
              setFormOpen(false);
            }
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
        <Button onClick={() => handleAdd('Context')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Context, Challenges &amp; Opportunities
        </Button>
        <ContextForm
          isOpen={isFormOpen}
          setIsOpen={setFormOpen}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={editingItem}
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
         <Button variant="ghost" size="sm" onClick={() => handleAdd('Context')}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="p-0">
          <NarrativeDisplay
            title="Context"
            items={context}
            onEdit={handleEdit}
            onDelete={handleDelete}
            placeholder="No context identified."
          />
          <NarrativeDisplay
            title="Challenges"
            items={challenges}
            onEdit={handleEdit}
            onDelete={handleDelete}
            placeholder="No challenges identified."
          />
          <NarrativeDisplay
            title="Opportunities"
            items={opportunities}
            onEdit={handleEdit}
            onDelete={handleDelete}
            placeholder="No opportunities identified."
          />
      </CardContent>
      <ContextForm
        isOpen={isFormOpen}
        setIsOpen={setFormOpen}
        onSave={handleSave}
        isSaving={isSaving}
        initialData={editingItem}
      />
    </Card>
  );
}
