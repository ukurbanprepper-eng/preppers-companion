import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'default' | 'large';
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  unit, 
  icon, 
  variant = 'default',
  size = 'default',
  className 
}: StatCardProps) {
  const variantStyles = {
    default: 'border-border bg-card',
    success: 'border-green-700/40 bg-green-950/20',
    warning: 'border-amber-700/40 bg-amber-950/20',
    danger: 'border-red-700/40 bg-red-950/20',
  };

  const variantTextColor = {
    default: 'text-foreground',
    success: 'text-green-400',
    warning: 'text-amber-400',
    danger: 'text-red-400',
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all',
        variantStyles[variant],
        className
      )}
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                'font-mono font-bold',
                size === 'large' ? 'text-5xl md:text-6xl' : 'text-3xl',
                variantTextColor[variant]
              )}
            >
              {value}
            </span>
            {unit && (
              <span className={cn(
                'font-mono font-medium text-muted-foreground',
                size === 'large' ? 'text-xl' : 'text-base'
              )}>
                {unit}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={cn(
            'rounded-md p-2',
            variant === 'success' && 'bg-green-900/30 text-green-400',
            variant === 'warning' && 'bg-amber-900/30 text-amber-400',
            variant === 'danger' && 'bg-red-900/30 text-red-400',
            variant === 'default' && 'bg-muted text-muted-foreground'
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
