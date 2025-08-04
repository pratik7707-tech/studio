
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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { DatePicker } from '../ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Trash2 } from 'lucide-react';

const fundingSourceSchema = z.object({
  source: z.string().min(1, 'Required'),
  '2026': z.number().optional(),
  '2027': z.number().optional(),
  '2028': z.number().optional(),
  '2029': z.number().optional(),
});

const positionSchema = z.object({
  department: z.string().min(1, 'Please select Department.'),
  location: z.string().min(1, 'Please select Location.'),
  grade: z.string().min(1, 'Please select a grade type and grade'),
  positionNumber: z.string().min(1, 'Position Number is required'),
  positionTitle: z.string().min(1, 'Position title is required'),
  startDate: z.date({ required_error: 'Start Month/Year is required.' }),
  endDate: z.date({ required_error: 'End Month/Year is required.' }),
  justification: z.string().min(1, 'Justification is required').max(500, 'Must be 500 characters or less'),
  fundingSources: z.array(fundingSourceSchema).min(1, 'At least one funding source is required.'),
}).refine(data => {
    // Custom validation to check if percentages for each year sum to 100
    const years = ['2026', '2027', '2028', '2029'];
    for (const year of years) {
        const total = data.fundingSources.reduce((acc, source) => acc + (source[year as keyof typeof source] || 0), 0);
        if (total !== 100 && total !== 0) return false;
    }
    return true;
}, {
    message: 'Percentage must be 100% for each year with funding.',
    path: ['fundingSources'],
}).refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be earlier than start date.",
    path: ["endDate"],
});


export type PositionFormData = z.infer<typeof positionSchema>;

interface CreatePositionSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: PositionFormData) => void;
}

export function CreatePositionSheet({ 
    isOpen, 
    setIsOpen, 
    onSave,
}: CreatePositionSheetProps) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      department: '',
      location: '',
      grade: '',
      positionNumber: '',
      positionTitle: '',
      justification: '',
      fundingSources: [],
    },
  });
  
  useEffect(() => {
    if (isOpen) {
        reset();
    }
  }, [isOpen, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fundingSources",
  });

  const justificationLength = watch('justification')?.length || 0;
  
  const onSubmit = (data: PositionFormData) => {
    onSave(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-[800px] flex flex-col">
        <SheetHeader>
          <SheetTitle>New Position</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto pr-6 pl-1 space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="font-semibold">Select Department<span className="text-destructive">*</span></Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
              <Label htmlFor="location" className="font-semibold">Location<span className="text-destructive">*</span></Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="location" className={cn(errors.location && "border-destructive")}>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="albania">Albania</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade" className="font-semibold">Select Grade<span className="text-destructive">*</span></Label>
              <Controller
                name="grade"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="grade" className={cn(errors.grade && "border-destructive")}>
                      <SelectValue placeholder="Select a grade type and grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usg">USG</SelectItem>
                      <SelectItem value="asg">ASG</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.grade && <p className="text-xs text-destructive">{errors.grade.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="positionNumber" className="font-semibold">Position Number<span className="text-destructive">*</span></Label>
              <Controller name="positionNumber" control={control} render={({ field }) => <Input {...field} placeholder="Enter position number" className={cn(errors.positionNumber && "border-destructive")} />} />
              {errors.positionNumber && <p className="text-xs text-destructive">{errors.positionNumber.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="positionTitle" className="font-semibold">Position title<span className="text-destructive">*</span></Label>
            <Controller name="positionTitle" control={control} render={({ field }) => <Input {...field} placeholder="Enter position title" className={cn(errors.positionTitle && "border-destructive")} />} />
            {errors.positionTitle && <p className="text-xs text-destructive">{errors.positionTitle.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="font-semibold">Start Month/Year<span className="text-destructive">*</span></Label>
              <Controller name="startDate" control={control} render={({ field }) => <DatePicker {...field} className={cn(errors.startDate && "border-destructive")} />} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="font-semibold">End Month/Year<span className="text-destructive">*</span></Label>
              <Controller name="endDate" control={control} render={({ field }) => <DatePicker {...field} className={cn(errors.endDate && "border-destructive")} />} />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="justification" className="font-semibold">Enter Justification<span className="text-destructive">*</span></Label>
            <Controller
              name="justification"
              control={control}
              render={({ field }) => (
                <>
                  <Textarea {...field} placeholder="Enter justification" className={cn("min-h-[100px]", errors.justification && "border-destructive")} />
                  <p className={cn("text-xs text-right", justificationLength > 500 ? "text-destructive" : "text-muted-foreground")}>
                    {justificationLength}/500 characters
                  </p>
                </>
              )}
            />
            {errors.justification && <p className="text-xs text-destructive">{errors.justification.message}</p>}
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-lg">POSITION FUNDING DISTRIBUTION</h3>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Funding Source</TableHead>
                            <TableHead>2026</TableHead>
                            <TableHead>2027</TableHead>
                            <TableHead>2028</TableHead>
                            <TableHead>2029</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <Controller
                                        name={`fundingSources.${index}.source`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Funding Source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="source1">Source 1</SelectItem>
                                                    <SelectItem value="source2">Source 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Controller name={`fundingSources.${index}.2026`} control={control} render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} placeholder="%" />} />
                                </TableCell>
                                <TableCell>
                                    <Controller name={`fundingSources.${index}.2027`} control={control} render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} placeholder="%" />} />
                                </TableCell>
                                <TableCell>
                                    <Controller name={`fundingSources.${index}.2028`} control={control} render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} placeholder="%" />} />
                                </TableCell>
                                <TableCell>
                                    <Controller name={`fundingSources.${index}.2029`} control={control} render={({ field }) => <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} placeholder="%" />} />
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="p-4">
                     <Button type="button" variant="outline" size="sm" onClick={() => append({ source: '', '2026': 0, '2027': 0, '2028': 0, '2029': 0 })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Source
                    </Button>
                    {errors.fundingSources && <p className="text-xs text-destructive mt-2">{errors.fundingSources.message || errors.fundingSources.root?.message}</p>}
                </div>
            </div>
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

    