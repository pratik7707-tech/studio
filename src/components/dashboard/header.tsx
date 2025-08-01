'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from '@/components/icons';
import { Filter, Sparkles } from 'lucide-react';

interface HeaderProps {
  onGetAiSuggestions: () => void;
}

export function Header({ onGetAiSuggestions }: HeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">BudgetWise</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="v1">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">V1</SelectItem>
                <SelectItem value="v2" disabled>V2</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="2026-29">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-29">2026-29</SelectItem>
                <SelectItem value="2025-28" disabled>2025-28</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="B0002">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B0002">B0002-Corp HQ</SelectItem>
                <SelectItem value="B0003" disabled>B0003-R&D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onGetAiSuggestions} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Sparkles className="mr-2 h-4 w-4" />
            Get AI Suggestions
          </Button>
        </div>
      </div>
    </header>
  );
}
