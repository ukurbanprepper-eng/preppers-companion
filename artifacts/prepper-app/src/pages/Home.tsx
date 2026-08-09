import { useState } from 'react';
import { Shield } from 'lucide-react';
import { TabNavigation, DesktopTabNavigation } from '@/components/TabNavigation';
import Dashboard from './Dashboard';
import Pantry from './Pantry';
import Medicines from './Medicines';
import Shopping from './Shopping';
import Health from './Health';
import Settings from './Settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard />;
      case 'pantry':     return <Pantry />;
      case 'medicines':  return <Medicines />;
      case 'shopping':   return <Shopping />;
      case 'health':     return <Health />;
      case 'settings':   return <Settings />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-2">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">
                Prepper's Companion
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Emergency Readiness Tool
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Tab Navigation */}
      <DesktopTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {renderTabContent()}
      </main>

      {/* Mobile Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
