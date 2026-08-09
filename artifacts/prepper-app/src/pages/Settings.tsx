import { useState } from 'react';
import { Moon, Sun, Trash2, AlertTriangle } from 'lucide-react';
import { usePrepper } from '@/contexts/PrepperContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { themeMode, setThemeMode, clearPantry, clearMedicines } = usePrepper();
  const [confirmDialog, setConfirmDialog] = useState<'pantry' | 'medicines' | null>(null);

  function handleConfirm() {
    if (confirmDialog === 'pantry') clearPantry();
    if (confirmDialog === 'medicines') clearMedicines();
    setConfirmDialog(null);
  }

  return (
    <div className="space-y-8 pb-6 max-w-xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customise your app preferences</p>
      </div>

      {/* Appearance */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Appearance
        </h2>
        <Card className="p-4 border-card-border">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="font-semibold">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between dark and light mode
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-1">
              <button
                onClick={() => setThemeMode('dark')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  themeMode === 'dark'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                data-testid="theme-dark"
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </button>
              <button
                onClick={() => setThemeMode('light')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  themeMode === 'light'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                data-testid="theme-light"
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* Data Management */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Data Management
        </h2>
        <div className="space-y-3">
          <Card className="p-4 border-card-border">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-semibold">Clear Pantry</p>
                <p className="text-sm text-muted-foreground">
                  Remove all food items from your pantry list
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 shrink-0"
                onClick={() => setConfirmDialog('pantry')}
                data-testid="btn-clear-pantry"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </Card>

          <Card className="p-4 border-card-border">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-semibold">Clear Medicines</p>
                <p className="text-sm text-muted-foreground">
                  Remove all medicine items from your medicines list
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 shrink-0"
                onClick={() => setConfirmDialog('medicines')}
                data-testid="btn-clear-medicines"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog !== null} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>
                Clear {confirmDialog === 'pantry' ? 'Pantry' : 'Medicines'}?
              </DialogTitle>
            </div>
            <DialogDescription>
              You will lose all {confirmDialog === 'pantry' ? 'pantry food items' : 'medicine items'}.
              Are you sure you want to do this? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(null)}
              data-testid="btn-confirm-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              data-testid="btn-confirm-clear"
            >
              Yes, clear all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
