'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles } from 'lucide-react';

interface AiSuggestionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  suggestions: string;
}

export function AiSuggestionDialog({ open, setOpen, isLoading, suggestions }: AiSuggestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Sparkles className="w-6 h-6 text-accent" />
            AI Budget Suggestions
          </DialogTitle>
          <DialogDescription>
            Here are some AI-powered suggestions to optimize your budget based on the provided data.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Analyzing your budget...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
              {suggestions.split('\n').map((line, index) => {
                if(line.startsWith('- ') || line.startsWith('* ')) {
                  return <p key={index} className="pl-4 mb-2">{line}</p>
                }
                return <p key={index} className="font-bold mb-2">{line}</p>
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
