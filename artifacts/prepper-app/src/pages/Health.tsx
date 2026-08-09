import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Calculator } from 'lucide-react';
import { usePrepper } from '@/contexts/PrepperContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatCard } from '@/components/StatCard';
import { cn } from '@/lib/utils';

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', multiplier: 1.2 },
  { value: 'lightly-active', label: 'Lightly Active', multiplier: 1.375 },
  { value: 'moderately-active', label: 'Moderately Active', multiplier: 1.55 },
  { value: 'very-active', label: 'Very Active', multiplier: 1.725 },
  { value: 'extra-active', label: 'Extra Active', multiplier: 1.9 },
];

export default function Health() {
  const { healthInputs, updateHealthInputs, updateHouseholdSettings } = usePrepper();
  const [bmi, setBmi] = useState(0);
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');

  // Convert weight to kg if needed
  const weightInKg =
    healthInputs.weightUnit === 'lbs'
      ? healthInputs.weight * 0.453592
      : healthInputs.weight;

  // Convert height to cm if needed
  const heightInCm =
    healthInputs.heightUnit === 'inches'
      ? healthInputs.height * 2.54
      : healthInputs.height;

  useEffect(() => {
    if (weightInKg > 0 && heightInCm > 0) {
      // Calculate BMI
      const heightInMeters = heightInCm / 100;
      const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);

      // Determine BMI category
      if (calculatedBmi < 18.5) {
        setBmiCategory('Underweight');
      } else if (calculatedBmi < 25) {
        setBmiCategory('Normal');
      } else if (calculatedBmi < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }

      // Calculate BMR using Mifflin-St Jeor
      let calculatedBmr;
      if (healthInputs.gender === 'male') {
        calculatedBmr = 10 * weightInKg + 6.25 * heightInCm - 5 * healthInputs.age + 5;
      } else {
        calculatedBmr = 10 * weightInKg + 6.25 * heightInCm - 5 * healthInputs.age - 161;
      }
      setBmr(calculatedBmr);

      // Calculate TDEE
      const activityMultiplier =
        activityLevels.find((level) => level.value === healthInputs.activityLevel)
          ?.multiplier || 1.55;
      const calculatedTdee = calculatedBmr * activityMultiplier;
      setTdee(calculatedTdee);
    }
  }, [healthInputs, weightInKg, heightInCm]);

  const handleApplyToDashboard = () => {
    const roundedTdee = Math.round(tdee / 10) * 10;
    updateHouseholdSettings({ dailyCalorieTarget: roundedTdee });
  };

  const getBmiVariant = () => {
    if (bmiCategory === 'Normal') return 'success';
    if (bmiCategory === 'Overweight' || bmiCategory === 'Underweight') return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health Tools</h1>
        <p className="text-muted-foreground">Calculate BMI and daily calorie requirements</p>
      </div>

      {/* Input Form */}
      <Card className="p-4 space-y-4 border-card-border">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Personal Information
        </h2>

        {/* Gender */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Gender</Label>
          <RadioGroup
            value={healthInputs.gender}
            onValueChange={(value) =>
              updateHealthInputs({ gender: value as 'male' | 'female' })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" data-testid="radio-male" />
              <Label htmlFor="male" className="font-normal cursor-pointer">
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" data-testid="radio-female" />
              <Label htmlFor="female" className="font-normal cursor-pointer">
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min="1"
            max="120"
            value={healthInputs.age}
            onChange={(e) => updateHealthInputs({ age: Number(e.target.value) })}
            className="font-mono"
            data-testid="input-age"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Weight</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              step="0.1"
              value={healthInputs.weight}
              onChange={(e) => updateHealthInputs({ weight: Number(e.target.value) })}
              className="font-mono flex-1"
              data-testid="input-weight"
            />
            <Select
              value={healthInputs.weightUnit}
              onValueChange={(value) =>
                updateHealthInputs({ weightUnit: value as 'kg' | 'lbs' })
              }
            >
              <SelectTrigger className="w-24" data-testid="select-weight-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lbs">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Height</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              step="0.1"
              value={healthInputs.height}
              onChange={(e) => updateHealthInputs({ height: Number(e.target.value) })}
              className="font-mono flex-1"
              data-testid="input-height"
            />
            <Select
              value={healthInputs.heightUnit}
              onValueChange={(value) =>
                updateHealthInputs({ heightUnit: value as 'cm' | 'inches' })
              }
            >
              <SelectTrigger className="w-24" data-testid="select-height-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="inches">inches</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-2">
          <Label htmlFor="activity" className="text-sm font-medium">
            Activity Level
          </Label>
          <Select
            value={healthInputs.activityLevel}
            onValueChange={(value) =>
              updateHealthInputs({
                activityLevel: value as typeof healthInputs.activityLevel,
              })
            }
          >
            <SelectTrigger id="activity" data-testid="select-activity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Calculated Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className={cn(
            'p-4 border',
            getBmiVariant() === 'success' && 'border-green-700/40 bg-green-950/20',
            getBmiVariant() === 'warning' && 'border-amber-700/40 bg-amber-950/20',
            getBmiVariant() === 'danger' && 'border-red-700/40 bg-red-950/20'
          )}>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                Body Mass Index
              </p>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  'text-4xl font-mono font-bold',
                  getBmiVariant() === 'success' && 'text-green-400',
                  getBmiVariant() === 'warning' && 'text-amber-400',
                  getBmiVariant() === 'danger' && 'text-red-400'
                )}>
                  {bmi > 0 ? bmi.toFixed(1) : '—'}
                </span>
              </div>
              {bmiCategory && (
                <div className={cn(
                  'inline-block px-2 py-1 rounded text-xs font-mono font-semibold',
                  getBmiVariant() === 'success' && 'bg-green-900/40 text-green-300',
                  getBmiVariant() === 'warning' && 'bg-amber-900/40 text-amber-300',
                  getBmiVariant() === 'danger' && 'bg-red-900/40 text-red-300'
                )}>
                  {bmiCategory}
                </div>
              )}
            </div>
          </Card>

          <StatCard
            label="Basal Metabolic Rate"
            value={bmr > 0 ? Math.round(bmr).toLocaleString() : '—'}
            unit="cal/day"
            icon={<Activity className="h-4 w-4" />}
          />
        </div>

        <StatCard
          label="Total Daily Energy Expenditure"
          value={tdee > 0 ? Math.round(tdee).toLocaleString() : '—'}
          unit="cal/day"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
          size="large"
        />

        {tdee > 0 && (
          <Button
            onClick={handleApplyToDashboard}
            className="w-full active-elevate"
            size="lg"
            data-testid="button-apply-to-dashboard"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Apply to Dashboard ({Math.round(tdee / 10) * 10} cal/day)
          </Button>
        )}
      </div>
    </div>
  );
}
