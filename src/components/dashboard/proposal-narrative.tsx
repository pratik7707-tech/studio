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
                    <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
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

  const handleAdd = (type: 'Context' | 'Challenge' | 'Opportunity') => {
    setEditingItem(undefined);
    setFormType(type);
    setFormOpen(true);
  };

  const handleEdit = (item: ContextItem) => {
    const type = context.some(c => c.id === item.id) ? 'Context' : challenges.some(c => c.id === item.id) ? 'Challenge' : 'Opportunity';
    setEditingItem(item);
    setFormType(type);
    setFormOpen(true);
  };
  
  const handleDelete = (itemToDelete: ContextItem) => {
    setContext(context.filter(item => item.id !== itemToDelete.id));
    setChallenges(challenges.filter(item => item.id !== itemToDelete.id));
    setOpportunities(opportunities.filter(item => item.id !== itemToDelete.id));
  };


  const handleSave = (item: { type: string; text: string; id?: string }) => {
    const newItem: ContextItem = {
      id: item.id || `item-${Date.now()}`,
      text: item.text,
    };

    const updateState = (
      setState: Dispatch<SetStateAction<ContextItem[]>>,
      currentItems: ContextItem[]
    ) => {
      const existingIndex = currentItems.findIndex(i => i.id === newItem.id);
      if (existingIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingIndex] = newItem;
        return updatedItems;
      }
      // If adding, remove from other lists first to ensure no duplicates if type changed
      setContext(context.filter(i => i.id !== newItem.id));
      setChallenges(challenges.filter(i => i.id !== newItem.id));
      setOpportunities(opportunities.filter(i => i.id !== newItem.id));
      return [...currentItems, newItem];
    };

    if (item.type === 'Context') {
      setContext(prev => updateState(setContext, prev));
    } else if (item.type === 'Challenge') {
      setChallenges(prev => updateState(setChallenges, prev));
    } else if (item.type === 'Opportunity') {
      setOpportunities(prev => updateState(setOpportunities, prev));
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
          initialData={editingItem ? { text: editingItem.text, type: formType, id: editingItem.id } : { type: formType, text: '' }}
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
        initialData={editingItem ? { text: editingItem.text, type: formType, id: editingItem.id } : { type: formType, text: '' }}
      />
    </div>
  );
}
