import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuantityControl } from './QuantityControl';
import { PantryItem } from '@/contexts/PrepperContext';
import { cn } from '@/lib/utils';

interface PantryItemCardProps {
  item: PantryItem;
  onUpdate: (updates: Partial<PantryItem>) => void;
  onDelete: () => void;
}

export function PantryItemCard({ item, onUpdate, onDelete }: PantryItemCardProps) {
  const progressPercent = Math.min((item.currentQuantity / item.targetQuantity) * 100, 100);
  const isStocked = item.currentQuantity >= item.targetQuantity;
  const isLow = progressPercent < 30;

  return (
    <div 
      className="rounded-lg border border-card-border bg-card p-4 space-y-3"
      data-testid={`pantry-item-${item.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-sm leading-tight">{item.name}</h4>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {item.caloriesPerItem} cal/item
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-7 w-7 text-muted-foreground hover:text-destructive active-elevate"
          data-testid={`delete-item-${item.id}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono">Stock Level</span>
          <span className={cn(
            'font-mono font-medium',
            isStocked ? 'text-green-400' : isLow ? 'text-red-400' : 'text-amber-400'
          )}>
            {item.currentQuantity} / {item.targetQuantity}
          </span>
        </div>
        <Progress 
          value={progressPercent} 
          className={cn(
            'h-1.5',
            isStocked && '[&>div]:bg-green-600',
            isLow && '[&>div]:bg-red-600',
            !isStocked && !isLow && '[&>div]:bg-amber-600'
          )}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <QuantityControl
          value={item.currentQuantity}
          onChange={(currentQuantity) => onUpdate({ currentQuantity })}
          label="Current"
          testId={`quantity-current-${item.id}`}
        />
      </div>
    </div>
  );
}
