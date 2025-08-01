'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import type { ContextItem } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';

interface NarrativeSectionProps {
  title: string;
  items: ContextItem[];
  placeholder: string;
}

const NarrativeSection = ({ title, items, placeholder }: NarrativeSectionProps) => (
  <div className="mb-4">
    <h3 className="text-md font-medium text-gray-700 mb-1">{title}</h3>
    {items.length > 0 ? (
      items.map(item => (
        <p key={item.id} className="text-sm text-muted-foreground">{item.text}</p>
      ))
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
  challenges,
  opportunities,
}: ProposalNarrativeProps) {
  // In a real app, these would open modals for editing or trigger a delete confirmation.
  const handleEdit = () => alert('Edit action triggered');
  const handleDelete = () => alert('Delete action triggered');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Context, Challenges &amp; Opportunities
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NarrativeSection 
        title="Context" 
        items={context} 
        placeholder="No context provided."
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
    </div>
  );
}
