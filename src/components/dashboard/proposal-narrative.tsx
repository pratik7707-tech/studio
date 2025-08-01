'use client';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { ContextItem } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { ContextForm } from './context-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveNarrativeItem, deleteNarrativeItem } from '@/app/actions';
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

interface NarrativeSectionProps {
  title: string;
  items: ContextItem[];
  onAdd: () => void;
  onEdit: (item: ContextItem) => void;
  onDelete: (item: ContextItem) => void;
}

const NarrativeSection = ({ title, items, onAdd, onEdit, onDelete }: NarrativeSectionProps) => (
  <Card className="mb-4 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <Button variant="ghost" size="sm" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" /> Add
      </Button>
    </CardHeader>
    <CardContent>
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
        <p className="text-sm text-muted-foreground italic">No {title.toLowerCase()} added yet.</p>
      )}
    </CardContent>
  </Card>
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
  const { toast } = useToast();

  const handleAdd = (type: 'Context' | 'Challenge' | 'Opportunity') => {
    setEditingItem(undefined);
    setFormType(type);
    setFormOpen(true);
  };

  const handleEdit = (item: ContextItem) => {
    const type = context.some(c => c.id === item.id) ? 'Context' : challenges.some(c => c.id === item.id) ? 'Challenge' : 'Opportunity';
    setEditingItem({ ...item, type });
    setFormType(type);
    setFormOpen(true);
  };

  const handleDelete = async (itemToDelete: ContextItem) => {
    const result = await deleteNarrativeItem(itemToDelete.id);
    if (result.success) {
      setContext(context.filter(item => item.id !== itemToDelete.id));
      setChallenges(challenges.filter(item => item.id !== itemToDelete.id));
      setOpportunities(opportunities.filter(item => item.id !== itemToDelete.id));
      toast({ title: 'Success!', description: 'Item deleted.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleSave = async (data: { [key: string]: string | undefined }) => {
    setIsSaving(true);
    const itemToSave: ContextItem = {
      id: editingItem?.id || '',
      text: data[formType.toLowerCase()] || '',
      type: formType,
    };
    
    if (!itemToSave.text) {
        toast({ variant: 'destructive', title: 'Error', description: 'Text cannot be empty.' });
        setIsSaving(false);
        return;
    }

    try {
        if(editingItem) {
          // This is an edit
          const result = await saveNarrativeItem(itemToSave);
          if (result.success && result.id) {
             const updateState = (setter: Dispatch<SetStateAction<ContextItem[]>>) => {
                setter(prev => prev.map(item => item.id === result.id ? {...item, text: itemToSave.text} : item));
             }
             if (itemToSave.type === 'Context') updateState(setContext);
             if (itemToSave.type === 'Challenge') updateState(setChallenges);
             if (itemToSave.type === 'Opportunity') updateState(setOpportunities);

             toast({ title: 'Success!', description: 'Your item has been updated.' });
             setFormOpen(false);
          } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
          }
        } else {
          // This is a new item (or items)
           const promises = [];
      
          if (data.context) {
            promises.push(saveNarrativeItem({ text: data.context, type: 'Context' }));
          }
          if (data.challenge) {
            promises.push(saveNarrativeItem({ text: data.challenge, type: 'Challenge' }));
          }
          if (data.opportunity) {
            promises.push(saveNarrativeItem({ text: data.opportunity, type: 'Opportunity' }));
          }

          const results = await Promise.all(promises);

          let hadError = false;
          results.forEach(result => {
            if (result.success && result.id) {
              const text = result.id === "context" ? data.context! : result.id === "challenge" ? data.challenge! : data.opportunity!
              const type: 'Context' | 'Challenge' | 'Opportunity' = promises[results.indexOf(result)].type;

              const newItem = {
                id: result.id,
                text: (data as any)[type.toLowerCase()],
                type: type
              }
              
              if (type === 'Context') setContext(prev => [...prev, newItem]);
              else if (type === 'Challenge') setChallenges(prev => [...prev, newItem]);
              else if (type === 'Opportunity') setOpportunities(prev => [...prev, newItem]);

            } else {
              hadError = true;
              console.error("Failed to save item:", result.error);
            }
          });

           if (hadError) {
             toast({ variant: 'destructive', title: 'Error', description: 'One or more items failed to save.' });
           } else {
             toast({ title: 'Success!', description: 'Your items have been saved.' });
             setFormOpen(false);
           }
        }
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message || 'An unexpected error occurred.' });
    } finally {
        setIsSaving(false);
    }
  };


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
          initialData={editingItem ? { text: editingItem.text, type: formType, id: editingItem.id } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Context, Challenges &amp; Opportunities
      </h2>
      <NarrativeSection
        title="Context"
        items={context}
        onAdd={() => handleAdd('Context')}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <NarrativeSection
        title="Challenges"
        items={challenges}
        onAdd={() => handleAdd('Challenge')}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <NarrativeSection
        title="Opportunities"
        items={opportunities}
        onAdd={() => handleAdd('Opportunity')}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ContextForm
        isOpen={isFormOpen}
        setIsOpen={setFormOpen}
        onSave={handleSave}
        isSaving={isSaving}
        initialData={editingItem ? { text: editingItem.text, type: formType, id: editingItem.id } : undefined}
      />
    </div>
  );
}