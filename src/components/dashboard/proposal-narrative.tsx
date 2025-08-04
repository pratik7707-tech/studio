'use client';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Upload } from 'lucide-react';
import type { NarrativeData } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';
import { ContextForm } from './context-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveNarrative, deleteNarrative, getNarrative, uploadNarrativeFromDocx } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
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
import { Skeleton } from '../ui/skeleton';

interface NarrativeSectionProps {
  title: string;
  text: string;
  placeholder: string;
}

const NarrativeSection = ({ title, text, placeholder }: NarrativeSectionProps) => (
  <div className="mb-4">
    <h3 className="text-md font-semibold mb-2">{title}</h3>
    {text ? (
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{text}</p>
    ) : (
      <p className="text-sm text-muted-foreground italic">{placeholder}</p>
    )}
  </div>
);

export function ProposalNarrative() {
  const [narrativeData, setNarrativeData] = useState<NarrativeData | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const result = await getNarrative();
      if (result.success && result.data) {
        setNarrativeData(result.data);
      } else if (!result.success) {
        toast({ variant: 'destructive', title: 'Error loading data', description: result.error });
      }
      setIsLoading(false);
    }
    loadData();
  }, [toast]);

  const handleEdit = () => {
    setFormOpen(true);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a .docx file.' });
        return;
      }

      setIsSaving(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await uploadNarrativeFromDocx(buffer);
        if (result.success && result.data) {
          setNarrativeData(result.data);
          toast({ title: 'Success!', description: 'Your narrative has been uploaded and saved.' });
        } else {
          toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to upload file.' });
        }
      } catch (e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message || 'An unexpected error occurred during upload.' });
      } finally {
        setIsSaving(false);
        // Reset file input
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };


  const handleDeleteAll = async () => {
    const result = await deleteNarrative();
    if (result.success) {
      setNarrativeData({ id: 'narrative_1', context: '', challenge: '', opportunity: '' });
      toast({ title: 'Success!', description: 'All narrative items have been deleted.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleSave = async (data: {
    context?: string;
    challenge?: string;
    opportunity?: string;
  }) => {
    setIsSaving(true);
    const saveData = {
        context: data.context || "",
        challenge: data.challenge || "",
        opportunity: data.opportunity || ""
    };

    try {
      const result = await saveNarrative(saveData);
      if (result.success && result.data) {
        setNarrativeData(result.data);
        toast({ title: 'Success!', description: 'Your narrative has been saved.' });
        setFormOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message || 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }
  
  const noData = !narrativeData || (!narrativeData.context && !narrativeData.challenge && !narrativeData.opportunity);

  if (noData) {
    return (
      <>
        <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
          <p className="mb-4 text-muted-foreground">To begin, please create your first Context, Challenges &amp; Opportunities</p>
          <div className="flex gap-2">
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Manually
            </Button>
            <Button variant="outline" onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload DOCX
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".docx"
            />
          </div>
        </div>
        <ContextForm
          isOpen={isFormOpen}
          setIsOpen={setFormOpen}
          onSave={handleSave}
          isSaving={isSaving}
          initialData={narrativeData || undefined}
        />
      </>
    );
  }
  
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Context, Challenges &amp; Opportunities
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              <span>Upload .docx</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all narrative items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <NarrativeSection
          title="Context"
          text={narrativeData?.context || ''}
          placeholder="No context identified."
        />
        <NarrativeSection
          title="Challenges"
          text={narrativeData?.challenge || ''}
          placeholder="No challenges identified."
        />
        <NarrativeSection
          title="Opportunities"
          text={narrativeData?.opportunity || ''}
          placeholder="No opportunities identified."
        />
      </CardContent>
      <ContextForm
        isOpen={isFormOpen}
        setIsOpen={setFormOpen}
        onSave={handleSave}
        isSaving={isSaving}
        initialData={narrativeData || undefined}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".docx"
      />
    </Card>
  );
}
