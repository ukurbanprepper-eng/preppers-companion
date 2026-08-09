import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  testId?: string;
}

export function QuantityControl({ 
  value, 
  onChange, 
  min = 0, 
  max = 9999,
  label,
  testId 
}: QuantityControlProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-sm text-muted-foreground font-mono mr-2">{label}</span>
      )}
      <div className="flex items-center gap-1 rounded-md border border-input bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-8 w-8 rounded-r-none border-r active-elevate"
          data-testid={`${testId}-decrement`}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          className={cn(
            'w-16 bg-transparent text-center font-mono text-sm font-medium',
            'focus:outline-none focus:ring-0 border-none'
          )}
          min={min}
          max={max}
          data-testid={testId}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-8 w-8 rounded-l-none border-l active-elevate"
          data-testid={`${testId}-increment`}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
