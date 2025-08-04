
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { NarrativeData } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  Context: z.string().optional(),
  Challenges: z.string().optional(),
  Opportunities: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ContextFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: FormData) => void;
  isSaving: boolean;
  initialData?: NarrativeData;
}

export function ContextForm({ isOpen, setIsOpen, onSave, isSaving, initialData }: ContextFormProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { Context: '', Challenges: '', Opportunities: '' },
  });

  const isEditing = !!initialData && (!!initialData.Context || !!initialData.Challenges || !!initialData.Opportunities);

  useEffect(() => {
    if (isOpen) {
        reset({
          Context: initialData?.Context || '',
          Challenges: initialData?.Challenges || '',
          Opportunities: initialData?.Opportunities || '',
        });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: FormData) => {
    onSave(data);
  };

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
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Narrative' : 'Add Narrative'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <>
                <div className="space-y-2">
                  <Label htmlFor="context">Context</Label>
                  <Controller
                    name="Context"
                    control={control}
                    render={({ field }) => <Textarea {...field} placeholder="Enter context" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenge">Challenge</Label>
                  <Controller
                    name="Challenges"
                    control={control}
                    render={({ field }) => <Textarea {...field} placeholder="Enter challenge" />}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opportunity">Opportunity</Label>
                  <Controller
                    name="Opportunities"
                    control={control}
                    render={({ field }) => <Textarea {...field} placeholder="Enter opportunity" />}
                  />
                </div>
              </>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>All the unsaved data will be lost, please confirm to proceed?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
