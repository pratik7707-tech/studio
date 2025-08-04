
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
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const standardInitiativeSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  standardInitiative: z.string().min(1, 'Please select a standard initiative.'),
  priority: z.enum(['Low', 'Medium', 'High']),
  rationale: z.string().min(1, 'Rationale is required').max(500, 'Rationale must be 500 characters or less'),
  risk: z.string().min(1, 'Risk is required').max(500, 'Risk must be 500 characters or less'),
});

export type StandardInitiativeFormData = z.infer<typeof standardInitiativeSchema>;

interface SelectStandardInitiativeSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: StandardInitiativeFormData) => void;
}

export function SelectStandardInitiativeSheet({
  isOpen,
  setIsOpen,
  onSave,
}: SelectStandardInitiativeSheetProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<StandardInitiativeFormData>({
    resolver: zodResolver(standardInitiativeSchema),
    defaultValues: {
      department: '',
      standardInitiative: '',
      priority: 'Medium',
      rationale: '',
      risk: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const rationaleLength = watch('rationale')?.length || 0;
  const riskLength = watch('risk')?.length || 0;

  const handleOpenChange = (open: boolean) => {
    if (!open && isDirty) {
      setIsAlertOpen(true);
    } else {
      setIsOpen(open);
    }
  };

  const handleConfirmClose = () => {
    setIsAlertOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="w-full sm:max-w-[640px] flex flex-col">
          <SheetHeader>
            <SheetTitle>Select Standard Initiative</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSave)} className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="font-semibold">
                  Select Department <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger id="department" className={cn(errors.department && "border-destructive")}>
                        <SelectValue placeholder="Select a Department" />
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
                <Label htmlFor="standardInitiative" className="font-semibold">
                  Select a Standard Initiative <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="standardInitiative"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <SelectTrigger id="standardInitiative" className={cn(errors.standardInitiative && "border-destructive")}>
                        <SelectValue placeholder="Select a Standard Initiative" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard Initiative 1">Standard Initiative 1</SelectItem>
                        <SelectItem value="Standard Initiative 2">Standard Initiative 2</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.standardInitiative && <p className="text-xs text-destructive">{errors.standardInitiative.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Initiative Priority <span className="text-destructive">*</span></Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} value={field.value} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Low" id="std-low" />
                      <Label htmlFor="std-low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Medium" id="std-medium" />
                      <Label htmlFor="std-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="High" id="std-high" />
                      <Label htmlFor="std-high">High</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rationale" className="font-semibold">
                Enter Initiative Rationale <span className="text-destructive">*</span>
              </Label>
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
              <Label htmlFor="risk" className="font-semibold">
                Enter risk of not implementing the initiative <span className="text-destructive">*</span>
              </Label>
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
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>All the unsaved data will be lost, please confirm to proceed?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleConfirmClose}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
