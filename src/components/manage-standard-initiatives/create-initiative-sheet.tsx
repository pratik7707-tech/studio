
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

const initiativeSchema = z.object({
  shortName: z.string().min(1, 'Initiative name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type InitiativeFormData = z.infer<typeof initiativeSchema>;

interface CreateInitiativeSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: InitiativeFormData) => void;
  isSaving: boolean;
}

export function CreateInitiativeSheet({
  isOpen,
  setIsOpen,
  onSave,
  isSaving,
}: CreateInitiativeSheetProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<InitiativeFormData>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      shortName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleOpenChange = (open: boolean) => {
    if (!open && isDirty && !isSaving) {
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
            <SheetTitle>New Standard Initiative</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSave)} className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shortName" className="font-semibold">
                Standard Initiative Name <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="shortName"
                control={control}
                render={({ field }) => (
                  <Input id="shortName" {...field} placeholder="Enter initiative name" className={cn(errors.shortName && 'border-destructive')} />
                )}
              />
              {errors.shortName && <p className="text-xs text-destructive">{errors.shortName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">
                Description <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea id="description" {...field} placeholder="Enter description" className={cn('min-h-[100px]', errors.description && 'border-destructive')} />
                )}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
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
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleConfirmClose}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
