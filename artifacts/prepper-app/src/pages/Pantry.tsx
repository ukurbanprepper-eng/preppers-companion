import { useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { usePrepper } from '@/contexts/PrepperContext';
import type { PantryItem } from '@/contexts/PrepperContext';
import { PantryItemCard } from '@/components/PantryItemCard';
import { AddItemDialog } from '@/components/AddItemDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const categoryLabels = {
  tinned: 'Tinned',
  dried: 'Dried',
  'freeze-dried': 'Freeze-Dried',
  other: 'Other',
};

type PantryCategory = keyof typeof categoryLabels;

const VALID_CATEGORIES: PantryCategory[] = ['tinned', 'dried', 'freeze-dried', 'other'];

function normaliseCategory(raw: string): PantryCategory | null {
  const s = raw.toLowerCase().trim();
  if (s === 'tinned' || s === 'canned') return 'tinned';
  if (s === 'dried' || s === 'dry') return 'dried';
  if (s === 'freeze-dried' || s === 'freeze dried' || s === 'freezedried') return 'freeze-dried';
  if (VALID_CATEGORIES.includes(s as PantryCategory)) return s as PantryCategory;
  return 'other';
}

type ImportResult = { imported: number; skipped: number; errors: string[] };

function parseCSV(text: string): { items: Omit<PantryItem, 'id'>[]; errors: string[] } {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const items: Omit<PantryItem, 'id'>[] = [];
  const errors: string[] = [];

  // Detect and skip header row
  const startIdx = lines[0]?.toLowerCase().includes('name') ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
    if (parts.length < 4) {
      errors.push(`Row ${i + 1}: not enough columns (expected name,calories,current,target[,category])`);
      continue;
    }
    const [name, calsRaw, currRaw, targetRaw, catRaw = 'other'] = parts;
    if (!name) { errors.push(`Row ${i + 1}: missing name`); continue; }
    const caloriesPerItem = parseInt(calsRaw, 10);
    const currentQuantity = parseInt(currRaw, 10);
    const targetQuantity = parseInt(targetRaw, 10);
    if (isNaN(caloriesPerItem) || isNaN(currentQuantity) || isNaN(targetQuantity)) {
      errors.push(`Row ${i + 1}: calories, current and target must be numbers`);
      continue;
    }
    items.push({
      name,
      caloriesPerItem,
      currentQuantity,
      targetQuantity,
      category: normaliseCategory(catRaw) ?? 'other',
    });
  }
  return { items, errors };
}

export default function Pantry() {
  const { pantryItems, updatePantryItem, deletePantryItem, addPantryItem } = usePrepper();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const getItemsByCategory = (category: PantryCategory) =>
    pantryItems.filter((item) => item.category === category);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { items, errors } = parseCSV(text);
      items.forEach(item => addPantryItem(item));
      setImportResult({ imported: items.length, skipped: errors.length, errors });
    };
    reader.readAsText(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Prepper Pantry</h1>
          <p className="text-muted-foreground">Track and manage your food inventory</p>
        </div>
        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
            data-testid="btn-import-csv"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
            data-testid="input-csv-file"
          />
        </div>
      </div>

      {/* CSV hint */}
      <div className="rounded-md border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground font-mono">
        CSV format: <span className="text-foreground">name, caloriesPerItem, currentQty, targetQty, category</span>
        &nbsp;— category: tinned | dried | freeze-dried | other
      </div>

      {/* Import result banner */}
      {importResult && (
        <div className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${
          importResult.errors.length === 0
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }`}>
          {importResult.errors.length === 0
            ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="font-semibold">
              {importResult.imported} item{importResult.imported !== 1 ? 's' : ''} imported
              {importResult.skipped > 0 && `, ${importResult.skipped} row${importResult.skipped !== 1 ? 's' : ''} skipped`}
            </p>
            {importResult.errors.length > 0 && (
              <ul className="mt-1 space-y-0.5 text-xs opacity-80">
                {importResult.errors.map((e, i) => <li key={i}>• {e}</li>)}
              </ul>
            )}
          </div>
          <button onClick={() => setImportResult(null)} className="shrink-0 opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs defaultValue="tinned" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="font-mono text-xs"
              data-testid={`tab-category-${key}`}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categoryLabels).map(([key, label]) => {
          const items = getItemsByCategory(key as PantryCategory);
          return (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {label} Goods
                  <span className="ml-2 text-sm text-muted-foreground font-mono">
                    ({items.length} items)
                  </span>
                </h2>
                <AddItemDialog
                  category={key as PantryCategory}
                  onAdd={addPantryItem}
                />
              </div>

              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                  <p className="text-sm text-muted-foreground font-mono">
                    No {label.toLowerCase()} items yet. Add your first item or import a CSV.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <PantryItemCard
                      key={item.id}
                      item={item}
                      onUpdate={(updates) => updatePantryItem(item.id, updates)}
                      onDelete={() => deletePantryItem(item.id)}
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
