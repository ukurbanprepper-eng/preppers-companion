import { Utensils, Droplet, Users, Flame } from 'lucide-react';
import { usePrepper } from '@/contexts/PrepperContext';
import { StatCard } from '@/components/StatCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const { householdSettings, updateHouseholdSettings, pantryItems } = usePrepper();

  // Calculate total calories stored
  const totalCaloriesStored = pantryItems.reduce(
    (sum, item) => sum + item.caloriesPerItem * item.currentQuantity,
    0
  );

  // Calculate daily calories needed
  const totalDailyCaloriesNeeded = householdSettings.numberOfPeople * householdSettings.dailyCalorieTarget;

  // Calculate days of food remaining
  const daysOfFoodRemaining = totalDailyCaloriesNeeded > 0 
    ? totalCaloriesStored / totalDailyCaloriesNeeded 
    : 0;

  // Calculate days of water supply
  const totalWaterNeeded = householdSettings.numberOfPeople * householdSettings.litresPerPersonPerDay;
  const daysOfWater = totalWaterNeeded > 0 
    ? householdSettings.totalLitresStored / totalWaterNeeded 
    : 0;

  // Determine variants for stat cards
  const getFoodVariant = (days: number) => {
    if (days < 7) return 'danger';
    if (days < 30) return 'warning';
    return 'success';
  };

  const getWaterVariant = (days: number) => {
    if (days < 7) return 'danger';
    if (days < 30) return 'warning';
    return 'success';
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Emergency Readiness</h1>
        <p className="text-muted-foreground">Monitor your household preparedness status</p>
      </div>

      {/* Household Settings */}
      <Card className="p-4 space-y-4 border-card-border">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Household Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="num-people" className="text-sm font-medium">
              Number of People
            </Label>
            <Input
              id="num-people"
              type="number"
              min="1"
              value={householdSettings.numberOfPeople}
              onChange={(e) => updateHouseholdSettings({ numberOfPeople: Number(e.target.value) })}
              className="font-mono"
              data-testid="input-num-people"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily-cal" className="text-sm font-medium">
              Daily Calories per Person
            </Label>
            <Input
              id="daily-cal"
              type="number"
              min="1000"
              max="5000"
              step="100"
              value={householdSettings.dailyCalorieTarget}
              onChange={(e) => updateHouseholdSettings({ dailyCalorieTarget: Number(e.target.value) })}
              className="font-mono"
              data-testid="input-daily-calories"
            />
          </div>
        </div>
      </Card>

      {/* Food Supply Metrics */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Food Supply Status
        </h2>
        
        <StatCard
          label="Days of Food Remaining"
          value={daysOfFoodRemaining.toFixed(1)}
          unit="days"
          icon={<Utensils className="h-5 w-5" />}
          variant={getFoodVariant(daysOfFoodRemaining)}
          size="large"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            label="Daily Calories Needed"
            value={totalDailyCaloriesNeeded.toLocaleString()}
            unit="cal"
            icon={<Flame className="h-4 w-4" />}
          />
          <StatCard
            label="Total Calories Stored"
            value={totalCaloriesStored.toLocaleString()}
            unit="cal"
            icon={<Utensils className="h-4 w-4" />}
          />
          <StatCard
            label="Household Size"
            value={householdSettings.numberOfPeople}
            unit="people"
            icon={<Users className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Water Supply Calculator */}
      <Card className="p-4 space-y-4 border-card-border">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Water Supply Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="litres-per-person" className="text-sm font-medium">
              Litres per Person per Day
            </Label>
            <Input
              id="litres-per-person"
              type="number"
              min="1"
              max="20"
              step="0.5"
              value={householdSettings.litresPerPersonPerDay}
              onChange={(e) => updateHouseholdSettings({ litresPerPersonPerDay: Number(e.target.value) })}
              className="font-mono"
              data-testid="input-litres-per-person"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-litres" className="text-sm font-medium">
              Total Litres Stored
            </Label>
            <Input
              id="total-litres"
              type="number"
              min="0"
              step="1"
              value={householdSettings.totalLitresStored}
              onChange={(e) => updateHouseholdSettings({ totalLitresStored: Number(e.target.value) })}
              className="font-mono"
              data-testid="input-total-litres"
            />
          </div>
        </div>

        <StatCard
          label="Days of Water Supply"
          value={daysOfWater.toFixed(1)}
          unit="days"
          icon={<Droplet className="h-5 w-5" />}
          variant={getWaterVariant(daysOfWater)}
          size="large"
        />
      </Card>
    </div>
  );
}
