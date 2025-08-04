'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, MoreVertical, Tag, Trash2, Edit, Eye } from 'lucide-react';
import type { BudgetItem } from '@/lib/types';
import { useState } from 'react';
import { CreateInitiativeSheet } from './create-initiative-sheet';
import type { InitiativeFormData } from './create-initiative-sheet';

interface InitiativeItemProps {
    item: BudgetItem;
    onUpdate: (id: string, field: keyof BudgetItem, value: string | number) => void;
    onRemove: (id: string) => void;
    onSave: (id: string, field: keyof BudgetItem, value: string | number) => void;
}

const departmentMap: { [key: string]: string } = {
    'B0002': 'B0002-Corp HQ - Management and Admin',
    'B0001': 'B0001-Executive Office',
    'B0010': 'B0010-Ethics Office',
    'B2107': 'B2107-Supply Chain Management Unit',
};

export function InitiativeItem({ item, onUpdate, onRemove, onSave }: InitiativeItemProps) {
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      };

    const handleSaveFromSheet = (formData: InitiativeFormData) => {
        Object.keys(formData).forEach(key => {
            onSave(item.id, key as keyof BudgetItem, formData[key as keyof InitiativeFormData]);
        });
        setIsEditSheetOpen(false);
    }

    return (
        <>
            <Collapsible>
                <div className="bg-white p-4 rounded-lg border flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                        <div className='flex items-center gap-4 cursor-pointer'>
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
                                <DropdownMenuItem onClick={() => onRemove(item.id)} className="text-destructive">
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
                    <div className="p-4 border-l border-r border-b rounded-b-lg space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Long Name</Label>
                                <Input value={item.longName} onChange={(e) => onUpdate(item.id, 'longName', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input type="number" value={item.amount} onChange={(e) => onUpdate(item.id, 'amount', Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Initiative Priority</Label>
                            <RadioGroup 
                                value={item.priority} 
                                onValueChange={(value) => onUpdate(item.id, 'priority', value)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Low" id={`${item.id}-low`} />
                                    <Label htmlFor={`${item.id}-low`}>Low</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Medium" id={`${item.id}-medium`} />
                                    <Label htmlFor={`${item.id}-medium`}>Medium</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="High" id={`${item.id}-high`} />
                                    <Label htmlFor={`${item.id}-high`}>High</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>Rationale</Label>
                            <Textarea value={item.rationale} onChange={(e) => onUpdate(item.id, 'rationale', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Risk</Label>
                            <Textarea value={item.risk} onChange={(e) => onUpdate(item.id, 'risk', e.target.value)} />
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
