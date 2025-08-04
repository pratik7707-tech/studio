
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, MoreVertical, Tag, Trash2, Edit, Eye, CircleDollarSign } from 'lucide-react';
import type { BudgetItem } from '@/lib/types';
import { useState } from 'react';
import { CreateInitiativeSheet } from './create-initiative-sheet';
import type { InitiativeFormData } from './create-initiative-sheet';
import { useToast } from '@/hooks/use-toast';

interface InitiativeItemProps {
    item: BudgetItem;
    onUpdate: (id: string, field: keyof BudgetItem, value: string | number) => void;
    onRemove: (id: string) => void;
    onSave: (id: string, formData: InitiativeFormData) => void;
}

const departmentMap: { [key: string]: string } = {
    'B0002': 'B0002-Corp HQ - Management and Admin',
    'B0001': 'B0001-Executive Office',
    'B0010': 'B0010-Ethics Office',
    'B2107': 'B2107-Supply Chain Management Unit',
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

export function InitiativeItem({ item, onUpdate, onRemove, onSave }: InitiativeItemProps) {
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const { toast } = useToast();

    const handleSaveFromSheet = (formData: InitiativeFormData) => {
        onSave(item.id, formData);
        setIsEditSheetOpen(false);
    }
    
    const handleFieldSave = (field: keyof BudgetItem, value: string | number) => {
        onUpdate(item.id, field, value);
        if (field === 'amount') {
          toast({ title: "Auto-saved!", description: `Updated amount to ${formatCurrency(Number(value))}`});
        }
    }

    return (
        <>
            <Collapsible>
                <div className="bg-white p-4 rounded-lg border flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                        <div className='flex items-center gap-4 cursor-pointer flex-grow'>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{item.shortName}</p>
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">{departmentMap[item.department] || item.department}</p>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 border-r pr-2 mr-2">
                            <CircleDollarSign className="h-5 w-5 text-gray-400" />
                            <Input 
                                type="number"
                                className="w-32 h-8 text-right font-semibold"
                                value={item.amount}
                                onChange={(e) => onUpdate(item.id, 'amount', Number(e.target.value))}
                                onBlur={(e) => handleFieldSave('amount', Number(e.target.value))}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsViewSheetOpen(true)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setIsEditSheetOpen(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onRemove(item.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>
                <CollapsibleContent>
                    <div className="p-4 border-l border-r border-b rounded-b-lg space-y-4 bg-gray-50">
                        <div className="space-y-2">
                            <Label>Long Name</Label>
                            <p className="text-sm text-muted-foreground">{item.longName}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Initiative Priority</Label>
                             <p className="text-sm text-muted-foreground">{item.priority}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Rationale</Label>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.rationale}</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Risk</Label>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.risk}</p>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <CreateInitiativeSheet
                isOpen={isViewSheetOpen}
                setIsOpen={setIsViewSheetOpen}
                isViewMode={true}
                initialData={item}
                onSave={() => {}}
            />
             <CreateInitiativeSheet
                isOpen={isEditSheetOpen}
                setIsOpen={setIsEditSheetOpen}
                initialData={item}
                onSave={handleSaveFromSheet}
            />
        </>
    )
}
