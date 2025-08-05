
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { BudgetEnvelope } from '@/lib/types';

const envelopeSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  y2026: z.number({ required_error: "Amount is required" }).min(0, 'Amount must be positive'),
  y2027: z.number({ required_error: "Amount is required" }).min(0, 'Amount must be positive'),
  y2028: z.number({ required_error: "Amount is required" }).min(0, 'Amount must be positive'),
  y2029: z.number({ required_error: "Amount is required" }).min(0, 'Amount must be positive'),
});

export type EnvelopeFormData = z.infer<typeof envelopeSchema>;

interface CreateEnvelopeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: EnvelopeFormData) => void;
  isSaving: boolean;
  initialData?: BudgetEnvelope | null;
}

export function CreateEnvelopeDialog({
  isOpen,
  setIsOpen,
  onSave,
  isSaving,
  initialData,
}: CreateEnvelopeDialogProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EnvelopeFormData>({
    resolver: zodResolver(envelopeSchema),
    defaultValues: {
      department: '',
      y2026: 0,
      y2027: 0,
      y2028: 0,
      y2029: 0,
    },
  });

  const title = initialData ? "Edit Budget Envelope" : "New Budget Envelope";

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                department: '',
                y2026: 0,
                y2027: 0,
                y2028: 0,
                y2029: 0,
              });
        }
    }
  }, [isOpen, initialData, reset]);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Controller
                name="department"
                control={control}
                render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <SelectTrigger id="department" className={cn(errors.department && "border-destructive")}>
                    <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="B0002-Corp HQ - Management and Admin">B0002-Corp HQ - Management and Admin</SelectItem>
                        <SelectItem value="B0001-Executive Office">B0001-Executive Office</SelectItem>
                        <SelectItem value="B0010-Ethics Office">B0010-Ethics Office</SelectItem>
                        <SelectItem value="B2107-Supply Chain Management Unit">B2107-Supply Chain Management Unit</SelectItem>
                    </SelectContent>
                </Select>
                )}
            />
            {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
                <Label htmlFor="y2026">2026 <span className="text-destructive">*</span></Label>
                <Controller
                    name="y2026"
                    control={control}
                    render={({ field }) => (
                        <Input id="y2026" {...field} value={field.value ?? ''} type="number" placeholder="Enter Amount" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className={cn(errors.y2026 && 'border-destructive')} />
                    )}
                />
                {errors.y2026 && <p className="text-xs text-destructive">{errors.y2026.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="y2027">2027 <span className="text-destructive">*</span></Label>
                <Controller
                    name="y2027"
                    control={control}
                    render={({ field }) => (
                        <Input id="y2027" {...field} value={field.value ?? ''} type="number" placeholder="Enter Amount" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className={cn(errors.y2027 && 'border-destructive')} />
                    )}
                />
                {errors.y2027 && <p className="text-xs text-destructive">{errors.y2027.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="y2028">2028 <span className="text-destructive">*</span></Label>
                <Controller
                    name="y2028"
                    control={control}
                    render={({ field }) => (
                        <Input id="y2028" {...field} value={field.value ?? ''} type="number" placeholder="Enter Amount" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className={cn(errors.y2028 && 'border-destructive')} />
                    )}
                />
                {errors.y2028 && <p className="text-xs text-destructive">{errors.y2028.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="y2029">2029 <span className="text-destructive">*</span></Label>
                <Controller
                    name="y2029"
                    control={control}
                    render={({ field }) => (
                        <Input id="y2029" {...field} value={field.value ?? ''} type="number" placeholder="Enter Amount" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className={cn(errors.y2029 && 'border-destructive')} />
                    )}
                />
                {errors.y2029 && <p className="text-xs text-destructive">{errors.y2029.message}</p>}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Budget Envelope
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
