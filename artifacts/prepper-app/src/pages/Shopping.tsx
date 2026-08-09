import { useState } from 'react';
import { CheckCircle2, Circle, ShoppingBag, Pill } from 'lucide-react';
import { usePrepper } from '@/contexts/PrepperContext';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ShoppingEntry = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  type: 'food' | 'medicine';
  needed: number;
  current: number;
  target: number;
};

const pantryLabels: Record<string, string> = {
  tinned: 'Tinned',
  dried: 'Dried',
  'freeze-dried': 'Freeze-Dried',
  other: 'Other',
};

const medicineLabels: Record<string, string> = {
  prescription: 'Prescription',
  'over-counter': 'Over Counter',
  supplements: 'Supplements',
};

export default function Shopping() {
  const { pantryItems, medicineItems } = usePrepper();
  const [collected, setCollected] = useState<Set<string>>(new Set());

  const foodEntries: ShoppingEntry[] = pantryItems
    .filter(item => item.currentQuantity < item.targetQuantity)
    .map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      categoryLabel: pantryLabels[item.category] ?? item.category,
      type: 'food',
      needed: item.targetQuantity - item.currentQuantity,
      current: item.currentQuantity,
      target: item.targetQuantity,
    }));

  const medicineEntries: ShoppingEntry[] = medicineItems
    .filter(item => item.doses < item.targetAmount)
    .map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      categoryLabel: medicineLabels[item.category] ?? item.category,
      type: 'medicine',
      needed: item.targetAmount - item.doses,
      current: item.doses,
      target: item.targetAmount,
    }));

  const shoppingList: ShoppingEntry[] = [...foodEntries, ...medicineEntries];

  const toggleCollected = (itemId: string) => {
    const newCollected = new Set(collected);
    if (newCollected.has(itemId)) {
      newCollected.delete(itemId);
    } else {
      newCollected.add(itemId);
    }
    setCollected(newCollected);
  };

  const collectedCount = collected.size;
  const totalCount = shoppingList.length;

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Smart Shopping List</h1>
        <p className="text-muted-foreground">
          Food and medicines below target stock level
        </p>
      </div>

      {/* Progress Summary */}
      {totalCount > 0 && (
        <Card className="p-4 border-card-border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                Collection Progress
              </p>
              <p className="text-2xl font-bold font-mono">
                {collectedCount} / {totalCount}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              {foodEntries.length > 0 && (
                <span>{foodEntries.length} food</span>
              )}
              {medicineEntries.length > 0 && (
                <span className="flex items-center gap-1">
                  <Pill className="h-3 w-3" />{medicineEntries.length} medicine{medicineEntries.length !== 1 ? 's' : ''}
                </span>
              )}
              <ShoppingBag className="h-8 w-8 text-primary ml-2" />
            </div>
          </div>
        </Card>
      )}

      {/* Shopping List */}
      {shoppingList.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">All Stocked Up!</h2>
          <p className="text-muted-foreground font-mono">
            Your pantry and medicines are at or above target levels. No shopping needed right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shoppingList.map((item) => {
            const isCollected = collected.has(item.id);
            return (
              <Card
                key={item.id}
                className={cn(
                  'p-4 border-card-border transition-all cursor-pointer hover-elevate',
                  isCollected && 'opacity-60 bg-muted/30'
                )}
                onClick={() => toggleCollected(item.id)}
                data-testid={`shopping-item-${item.id}`}
              >
                <div className="flex items-start gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full p-0 shrink-0"
                    onClick={(e) => { e.stopPropagation(); toggleCollected(item.id); }}
                    data-testid={`checkbox-${item.id}`}
                  >
                    {isCollected ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={cn(
                        'font-semibold leading-tight',
                        isCollected && 'line-through text-muted-foreground'
                      )}>
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.type === 'medicine' && (
                          <span className="flex items-center gap-1 text-xs font-mono text-primary/80 px-2 py-1 rounded bg-primary/10">
                            <Pill className="h-3 w-3" />
                            Medicine
                          </span>
                        )}
                        <span className="text-xs uppercase font-mono text-muted-foreground px-2 py-1 rounded bg-muted">
                          {item.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono text-muted-foreground">
                        Need: <span className="text-foreground font-semibold">{item.needed}</span>
                      </span>
                      <span className="font-mono text-muted-foreground">
                        Current: <span className="text-foreground">{item.current}</span>
                      </span>
                      <span className="font-mono text-muted-foreground">
                        Target: <span className="text-foreground">{item.target}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
