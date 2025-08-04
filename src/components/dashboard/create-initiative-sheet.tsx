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

const initiativeSchema = z.object({
  shortName: z.string().min(1, 'Short Name is required').max(40, 'Short Name must be 40 characters or less'),
  longName: z.string().min(1, 'Long Name is required').max(150, 'Long Name must be 150 characters or less'),
  department: z.string().min(1, 'Department is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  rationale: z.string().min(1, 'Rationale is required').max(500, 'Rationale must be 500 characters or less'),
  risk: z.string().min(1, 'Risk is required').max(500, 'Risk must be 500 characters or less'),
});

export type InitiativeFormData = z.infer<typeof initiativeSchema>;

interface CreateInitiativeSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: InitiativeFormData) => void;
}

export function CreateInitiativeSheet({ isOpen, setIsOpen, onSave }: CreateInitiativeSheetProps) {
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
    if (!isOpen) {
        reset();
    }
  }, [isOpen, reset]);

  const shortNameLength = watch('shortName')?.length || 0;
  const longNameLength = watch('longName')?.length || 0;
  const rationaleLength = watch('rationale')?.length || 0;
  const riskLength = watch('risk')?.length || 0;
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-[640px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Create New Initiative</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSave)} className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="shortName">Enter Short Name*</Label>
              <Controller
                name="shortName"
                control={control}
                render={({ field }) => (
                    <>
                        <Input id="shortName" {...field} placeholder="Enter Short Name" />
                        <p className={cn("text-xs text-right", shortNameLength > 40 ? "text-destructive" : "text-muted-foreground")}>
                            {shortNameLength}/40 characters
                        </p>
                        {errors.shortName && <p className="text-xs text-destructive">{errors.shortName.message}</p>}
                    </>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="longName">Enter Long Name*</Label>
              <Controller
                name="longName"
                control={control}
                render={({ field }) => (
                    <>
                        <Input id="longName" {...field} placeholder="Enter Long Name" />
                        <p className={cn("text-xs text-right", longNameLength > 150 ? "text-destructive" : "text-muted-foreground")}>
                            {longNameLength}/150 characters
                        </p>
                        {errors.longName && <p className="text-xs text-destructive">{errors.longName.message}</p>}
                    </>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="department">Select Department*</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="department">
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
          </div>
          <div className="space-y-2">
            <Label>Initiative Priority*</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="High" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rationale">Enter Initiative Rationale*</Label>
            <Controller
              name="rationale"
              control={control}
              render={({ field }) => (
                <>
                    <Textarea id="rationale" {...field} placeholder="Enter initiative rationale" className="min-h-[100px]" />
                    <p className={cn("text-xs text-right", rationaleLength > 500 ? "text-destructive" : "text-muted-foreground")}>
                        {rationaleLength}/500 characters
                    </p>
                    {errors.rationale && <p className="text-xs text-destructive">{errors.rationale.message}</p>}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="risk">Enter risk of not implementing the initiative*</Label>
            <Controller
              name="risk"
              control={control}
              render={({ field }) => (
                <>
                    <Textarea id="risk" {...field} placeholder="Enter risk of not implementing the initiative" className="min-h-[100px]" />
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

      </SheetContent>
    </Sheet>
  );
}
