import { Home, Package, ShoppingCart, Heart, Pill, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Home',      icon: Home },
  { id: 'pantry',    label: 'Pantry',    icon: Package },
  { id: 'medicines', label: 'Meds',      icon: Pill },
  { id: 'shopping',  label: 'Shopping',  icon: ShoppingCart },
  { id: 'health',    label: 'Health',    icon: Heart },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around px-0 py-1.5">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              data-testid={`tab-${tab.id}`}
              className={cn(
                'flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg transition-all min-w-0 flex-1',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'animate-pulse-subtle')} />
              <span className="text-[9px] font-mono font-medium leading-none truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopTabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="hidden md:flex items-center gap-2 border-b border-border bg-card px-6 py-3">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            data-testid={`tab-${tab.id}-desktop`}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium',
              'hover-elevate',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{tab.label === 'Home' ? 'Dashboard' : tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
