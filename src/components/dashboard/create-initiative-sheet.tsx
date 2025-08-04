'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import type { BudgetItem } from '@/lib/types';

const initiativeSchema = z.object({
  shortName: z.string().min(1, 'Short Name is required').max(40, 'Short Name must be 40 characters or less'),
  longName: z.string().min(1, 'Long Name is required').max(150, 'Long Name must be 150 characters or less'),
  department: z.string().min(1, 'Department is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  rationale: z.string().min(1, 'Rationale is required').max(500, 'Rationale must be 500 characters or less'),
  risk: z.string().min(1, 'Risk is required').max(500, 'Risk must be 500 characters or less'),
});

export type InitiativeFormData = z.infer<typeof initiativeSchema>;

const departmentMap: { [key: string]: string } = {
    'B0002': 'B0002-Corp HQ - Management and Admin',
    'B0001': 'B0001-Executive Office',
    'B0010': 'B0010-Ethics Office',
    'B2107': 'B2107-Supply Chain Management Unit',
};

interface CreateInitiativeSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: InitiativeFormData) => void;
  isViewMode?: boolean;
  initialData?: BudgetItem;
}

const ViewOnlyField = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="space-y-2">
      <Label className="font-semibold">{label}</Label>
      <div className="text-sm p-2 bg-gray-100 rounded-md min-h-[36px] flex items-center">{value}</div>
    </div>
);


export function CreateInitiativeSheet({ 
    isOpen, 
    setIsOpen, 
    onSave,
    isViewMode = false,
    initialData,
}: CreateInitiativeSheetProps) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<InitiativeFormData>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      shortName: '',
      longName: '',
      department: '',
      priority: 'Medium',
      rationale: '',
      risk: '',
    },
  });
  
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
              shortName: '',
              longName: '',
              department: '',
              priority: 'Medium',
              rationale: '',
              risk: '',
            });
        }
    }
  }, [isOpen, initialData, reset]);

  const shortNameLength = watch('shortName')?.length || 0;
  const longNameLength = watch('longName')?.length || 0;
  const rationaleLength = watch('rationale')?.length || 0;
  const riskLength = watch('risk')?.length || 0;
  
  const title = isViewMode ? "View Initiative" : (initialData ? "Edit Initiative" : "Create New Initiative");
  const departmentDisplay = initialData ? departmentMap[initialData.department] || initialData.department : '';


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-[640px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        {isViewMode && initialData ? (
            <div className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4 py-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1"><ViewOnlyField label="Short Name" value={initialData.shortName} /></div>
                    <div className="md:col-span-1"><ViewOnlyField label="Long Name" value={initialData.longName} /></div>
                </div>
                 <ViewOnlyField label="Department" value={departmentDisplay} />
                <ViewOnlyField label="Initiative Priority" value={initialData.priority} />
                <ViewOnlyField label="Initiative Rationale" value={initialData.rationale} />
                <ViewOnlyField label="Risk of not implementing" value={initialData.risk} />
                <SheetFooter className="pt-4">
                    <SheetClose asChild>
                        <Button type="button">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </div>
        ) : (
            <form onSubmit={handleSubmit(onSave)} className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-1">
                <Label htmlFor="shortName" className="font-semibold">Enter Short Name*</Label>
                <Controller
                    name="shortName"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Input id="shortName" {...field} placeholder="Enter Short Name" className={cn(errors.shortName && "border-destructive")} />
                            <p className={cn("text-xs text-right", shortNameLength > 40 ? "text-destructive" : "text-muted-foreground")}>
                                {shortNameLength}/40 characters
                            </p>
                            {errors.shortName && <p className="text-xs text-destructive">{errors.shortName.message}</p>}
                        </>
                    )}
                />
                </div>
                <div className="space-y-2 md:col-span-1">
                <Label htmlFor="longName" className="font-semibold">Enter Long Name*</Label>
                <Controller
                    name="longName"
                    control={control}
                    render={({ field }) => (
                        <>
                            <Input id="longName" {...field} placeholder="Enter Long Name" className={cn(errors.longName && "border-destructive")} />
                            <p className={cn("text-xs text-right", longNameLength > 150 ? "text-destructive" : "text-muted-foreground")}>
                                {longNameLength}/150 characters
                            </p>
                            {errors.longName && <p className="text-xs text-destructive">{errors.longName.message}</p>}
                        </>
                    )}
                />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="department" className="font-semibold">Select Department*</Label>
                <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <SelectTrigger id="department" className={cn(errors.department && "border-destructive")}>
                        <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="B0002">B0002-Corp HQ - Management and Admin</SelectItem>
                        <SelectItem value="B0001">B0001-Executive Office</SelectItem>
                        <SelectItem value="B0010">B0010-Ethics Office</SelectItem>
                        <SelectItem value="B2107">B2107-Supply Chain Management Unit</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
                {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
                </div>
            <div className="space-y-2">
                <Label className="font-semibold">Initiative Priority*</Label>
                <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} value={field.value} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Low" id={`${initialData?.id || 'new'}-low`} />
                        <Label htmlFor={`${initialData?.id || 'new'}-low`}>Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Medium" id={`${initialData?.id || 'new'}-medium`} />
                        <Label htmlFor={`${initialData?.id || 'new'}-medium`}>Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="High" id={`${initialData?.id || 'new'}-high`} />
                        <Label htmlFor={`${initialData?.id || 'new'}-high`}>High</Label>
                    </div>
                    </RadioGroup>
                )}
                />
                {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="rationale" className="font-semibold">Enter Initiative Rationale*</Label>
                <Controller
                name="rationale"
                control={control}
                render={({ field }) => (
                    <>
                        <Textarea id="rationale" {...field} placeholder="Enter initiative rationale" className={cn("min-h-[100px]", errors.rationale && "border-destructive")} />
                        <p className={cn("text-xs text-right", rationaleLength > 500 ? "text-destructive" : "text-muted-foreground")}>
                            {rationaleLength}/500 characters
                        </p>
                        {errors.rationale && <p className="text-xs text-destructive">{errors.rationale.message}</p>}
                    </>
                )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="risk" className="font-semibold">Enter risk of not implementing the initiative*</Label>
                <Controller
                name="risk"
                control={control}
                render={({ field }) => (
                    <>
                        <Textarea id="risk" {...field} placeholder="Enter risk of not implementing the initiative" className={cn("min-h-[100px]", errors.risk && "border-destructive")} />
                        <p className={cn("text-xs text-right", riskLength > 500 ? "text-destructive" : "text-muted-foreground")}>
                            {riskLength}/500 characters
                        </p>
                        {errors.risk && <p className="text-xs text-destructive">{errors.risk.message}</p>}
                    </>
                )}
                />
            </div>
            <SheetFooter className="pt-4">
            <SheetClose asChild>
                <Button type="button" variant="outline">
                Cancel
                </Button>
            </SheetClose>
            <Button type="submit">Save</Button>
            </SheetFooter>
            </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
