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
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { NarrativeData } from '@/lib/types';

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
  const {
    handleSubmit,
    control,
    reset,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
