import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PantryItem } from '@/contexts/PrepperContext';

interface AddItemDialogProps {
  category: PantryItem['category'];
  onAdd: (item: Omit<PantryItem, 'id'>) => void;
}

export function AddItemDialog({ category, onAdd }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [caloriesPerItem, setCaloriesPerItem] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('0');
  const [targetQuantity, setTargetQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !caloriesPerItem || !targetQuantity) return;

    onAdd({
      name,
      caloriesPerItem: Number(caloriesPerItem),
      currentQuantity: Number(currentQuantity),
      targetQuantity: Number(targetQuantity),
      category,
    });

    // Reset form
    setName('');
    setCaloriesPerItem('');
    setCurrentQuantity('0');
    setTargetQuantity('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full active-elevate"
          data-testid={`add-item-${category}`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold">Add New Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new {category} item to your pantry inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Canned Soup"
              required
              data-testid="input-item-name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calories">Calories per Item</Label>
            <Input
              id="calories"
              type="number"
              value={caloriesPerItem}
              onChange={(e) => setCaloriesPerItem(e.target.value)}
              placeholder="e.g. 250"
              min="0"
              required
              data-testid="input-calories"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Quantity</Label>
              <Input
                id="current"
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                placeholder="0"
                min="0"
                required
                data-testid="input-current-quantity"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target Quantity</Label>
              <Input
                id="target"
                type="number"
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(e.target.value)}
                placeholder="e.g. 10"
                min="1"
                required
                data-testid="input-target-quantity"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              data-testid="button-submit"
            >
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
