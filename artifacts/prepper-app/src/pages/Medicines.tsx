import { useState } from 'react';
import { Pill, Plus, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { usePrepper, MedicineItem, MedicineCategory } from '@/contexts/PrepperContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const categoryLabels: Record<MedicineCategory, string> = {
  prescription: 'Prescription',
  'over-counter': 'Over Counter',
  supplements: 'Supplements',
};

function expiryStatus(expiry: string): 'expired' | 'soon' | 'ok' {
  if (!expiry || !expiry.includes('/')) return 'ok';
  const [mm, yyyy] = expiry.split('/');
  const month = parseInt(mm, 10);
  const year = parseInt(yyyy, 10);
  if (isNaN(month) || isNaN(year)) return 'ok';
  const expiryDate = new Date(year, month - 1 + 1, 0);
  const now = new Date();
  const threeMonths = new Date();
  threeMonths.setMonth(threeMonths.getMonth() + 3);
  if (expiryDate < now) return 'expired';
  if (expiryDate < threeMonths) return 'soon';
  return 'ok';
}

interface AddMedicineDialogProps {
  category: MedicineCategory;
  onAdd: (item: Omit<MedicineItem, 'id'>) => void;
}

function AddMedicineDialog({ category, onAdd }: AddMedicineDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [doses, setDoses] = useState('0');
  const [expiry, setExpiry] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;
    onAdd({
      name: name.trim(),
      doses: parseInt(doses, 10) || 0,
      expiry: expiry.trim(),
      targetAmount: parseInt(targetAmount, 10) || 1,
      category,
    });
    setName(''); setDoses('0'); setExpiry(''); setTargetAmount('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2" data-testid={`add-medicine-${category}`}>
          <Plus className="h-4 w-4" />
          Add {categoryLabels[category]}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {categoryLabels[category]} Medicine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="med-name">Medicine Name</Label>
            <Input
              id="med-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Paracetamol"
              required
              data-testid="input-medicine-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="med-doses">Current Doses</Label>
              <Input
                id="med-doses"
                type="number"
                min="0"
                value={doses}
                onChange={e => setDoses(e.target.value)}
                data-testid="input-medicine-doses"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="med-target">Target Amount</Label>
              <Input
                id="med-target"
                type="number"
                min="1"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                placeholder="e.g. 60"
                required
                data-testid="input-medicine-target"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="med-expiry">Expiry Date (MM/YYYY)</Label>
            <Input
              id="med-expiry"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              placeholder="e.g. 06/2027"
              data-testid="input-medicine-expiry"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim() || !targetAmount}>
            Add Medicine
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface MedicineCardProps {
  item: MedicineItem;
  onUpdate: (updates: Partial<MedicineItem>) => void;
  onDelete: () => void;
}

function MedicineCard({ item, onUpdate, onDelete }: MedicineCardProps) {
  const progress = item.targetAmount > 0 ? Math.min(item.doses / item.targetAmount, 1) : 0;
  const status = expiryStatus(item.expiry);

  const progressColor =
    progress >= 1 ? 'bg-primary' : progress >= 0.5 ? 'bg-amber-500' : 'bg-destructive';

  const expiryColor =
    status === 'expired' ? 'text-destructive' :
    status === 'soon' ? 'text-amber-500' :
    'text-muted-foreground';

  const expiryLabel =
    status === 'expired' ? `Expired ${item.expiry}` :
    status === 'soon' ? `Exp ${item.expiry} — soon` :
    item.expiry ? `Exp ${item.expiry}` : 'No expiry set';

  return (
    <Card className="p-4 border-card-border space-y-3" data-testid={`medicine-card-${item.id}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-tight truncate">{item.name}</h3>
          <div className={cn('flex items-center gap-1 mt-0.5 text-xs font-mono', expiryColor)}>
            {status === 'expired' ? (
              <AlertTriangle className="h-3 w-3 shrink-0" />
            ) : status === 'soon' ? (
              <Clock className="h-3 w-3 shrink-0" />
            ) : null}
            {expiryLabel}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
          onClick={onDelete}
          data-testid={`delete-medicine-${item.id}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>{item.doses} doses</span>
          <span>target: {item.targetAmount}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', progressColor)}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Dose controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onUpdate({ doses: Math.max(0, item.doses - 1) })}
          data-testid={`decrease-doses-${item.id}`}
        >
          −
        </Button>
        <Input
          type="number"
          min="0"
          value={item.doses}
          onChange={e => onUpdate({ doses: parseInt(e.target.value, 10) || 0 })}
          className="h-7 w-16 text-center text-sm font-mono p-1"
          data-testid={`input-doses-${item.id}`}
        />
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onUpdate({ doses: item.doses + 1 })}
          data-testid={`increase-doses-${item.id}`}
        >
          +
        </Button>
        <span className="text-xs text-muted-foreground font-mono ml-auto">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </Card>
  );
}

export default function Medicines() {
  const { medicineItems, addMedicineItem, updateMedicineItem, deleteMedicineItem } = usePrepper();

  const getByCategory = (cat: MedicineCategory) =>
    medicineItems.filter(i => i.category === cat);

  const expiredCount = medicineItems.filter(i => expiryStatus(i.expiry) === 'expired').length;
  const soonCount = medicineItems.filter(i => expiryStatus(i.expiry) === 'soon').length;

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Medicines</h1>
        <p className="text-muted-foreground">Track doses, expiry dates and restock targets</p>
      </div>

      {/* Expiry alerts */}
      {(expiredCount > 0 || soonCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {expiredCount > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {expiredCount} expired medicine{expiredCount !== 1 ? 's' : ''}
            </div>
          )}
          {soonCount > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-500">
              <Clock className="h-4 w-4 shrink-0" />
              {soonCount} expiring within 3 months
            </div>
          )}
        </div>
      )}

      {/* Category Tabs */}
      <Tabs defaultValue="prescription" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {(Object.keys(categoryLabels) as MedicineCategory[]).map(cat => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="font-mono text-xs"
              data-testid={`tab-medicine-${cat}`}
            >
              {categoryLabels[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(categoryLabels) as MedicineCategory[]).map(cat => {
          const items = getByCategory(cat);
          return (
            <TabsContent key={cat} value={cat} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {categoryLabels[cat]}
                  <span className="ml-2 text-sm text-muted-foreground font-mono">
                    ({items.length} item{items.length !== 1 ? 's' : ''})
                  </span>
                </h2>
                <AddMedicineDialog category={cat} onAdd={addMedicineItem} />
              </div>

              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                  <Pill className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-mono">
                    No {categoryLabels[cat].toLowerCase()} medicines yet. Add your first item.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <MedicineCard
                      key={item.id}
                      item={item}
                      onUpdate={updates => updateMedicineItem(item.id, updates)}
                      onDelete={() => deleteMedicineItem(item.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
