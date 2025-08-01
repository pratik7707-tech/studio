'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContextItem } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from 'react';

interface ContextCardProps {
  title: string;
  items: ContextItem[];
  setItems: Dispatch<SetStateAction<ContextItem[]>>;
  icon: LucideIcon;
}

export function ContextCard({ title, items, setItems, icon: Icon }: ContextCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContextItem | null>(null);
  const [currentItemText, setCurrentItemText] = useState('');

  const handleOpenDialog = (item: ContextItem | null = null) => {
    setEditingItem(item);
    setCurrentItemText(item ? item.text : '');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, text: currentItemText } : i));
    } else {
      setItems([...items, { id: `ctx-${Date.now()}`, text: currentItemText }]);
    }
    setDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  }

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary" />
          <CardTitle className="font-headline text-lg">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40 pr-4">
          <div className="space-y-3">
            {items.length > 0 ? items.map(item => (
              <div key={item.id} className="flex items-center justify-between group">
                <p className="text-sm text-muted-foreground flex-grow pr-2">{item.text}</p>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenDialog(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No items yet.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} {title.slice(0,-1)}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="item-text" className="sr-only">Text</Label>
            <Textarea 
              id="item-text"
              value={currentItemText}
              onChange={(e) => setCurrentItemText(e.target.value)}
              placeholder={`Enter ${title.toLowerCase().slice(0,-1)} text...`}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
