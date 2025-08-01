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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

const formSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['Context', 'Challenge', 'Opportunity']),
  text: z.string().min(1, 'Text cannot be empty.'),
});

type FormData = z.infer<typeof formSchema>;

interface ContextFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: FormData) => void;
  initialData?: {
    id?: string;
    type: 'Context' | 'Challenge' | 'Opportunity';
    text: string;
  };
}

export function ContextForm({ isOpen, setIsOpen, onSave, initialData }: ContextFormProps) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { type: 'Context', text: '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { type: 'Context', text: '' });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: FormData) => {
    onSave(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Context">Context</SelectItem>
                    <SelectItem value="Challenge">Challenge</SelectItem>
                    <SelectItem value="Opportunity">Opportunity</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">Description</Label>
            <Controller
              name="text"
              control={control}
              render={({ field }) => <Textarea {...field} placeholder="Enter description" />}
            />
            {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
