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
import type { ContextItem } from '@/lib/types';

const formSchema = z.object({
  context: z.string().optional(),
  challenge: z.string().optional(),
  opportunity: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ContextFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: FormData) => void;
  isSaving: boolean;
  initialData?: {
    context: ContextItem[],
    challenges: ContextItem[],
    opportunities: ContextItem[]
  };
}

export function ContextForm({ isOpen, setIsOpen, onSave, isSaving, initialData }: ContextFormProps) {
  const {
    handleSubmit,
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { context: '', challenge: '', opportunity: '' },
  });

  const isEditing = !!initialData && (initialData.context.length > 0 || initialData.challenges.length > 0 || initialData.opportunities.length > 0);

  useEffect(() => {
    if (isOpen) {
        const contextText = initialData?.context.map(c => c.text).join('\\n') || '';
        const challengeText = initialData?.challenges.map(c => c.text).join('\\n') || '';
        const opportunityText = initialData?.opportunities.map(c => c.text).join('\\n') || '';
        reset({
          context: contextText,
          challenge: challengeText,
          opportunity: opportunityText,
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
                  name="context"
                  control={control}
                  render={({ field }) => <Textarea {...field} placeholder="Enter context" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge">Challenge</Label>
                <Controller
                  name="challenge"
                  control={control}
                  render={({ field }) => <Textarea {...field} placeholder="Enter challenge" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opportunity">Opportunity</Label>
                <Controller
                  name="opportunity"
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
