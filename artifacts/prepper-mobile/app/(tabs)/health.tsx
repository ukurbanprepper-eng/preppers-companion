import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { usePrepper } from '@/context/PrepperContext';
import { PageTitle } from '@/components/PageTitle';
import { useScreenPadding } from '@/hooks/useScreenPadding';

type Gender = 'male' | 'female';
type WeightUnit = 'kg' | 'lbs';
type HeightUnit = 'cm' | 'in';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

const ACTIVITY_OPTIONS: { key: ActivityLevel; label: string; multiplier: number }[] = [
  { key: 'sedentary', label: 'Sedentary', multiplier: 1.2 },
  { key: 'light', label: 'Lightly Active', multiplier: 1.375 },
  { key: 'moderate', label: 'Moderately Active', multiplier: 1.55 },
  { key: 'very', label: 'Very Active', multiplier: 1.725 },
  { key: 'extra', label: 'Extra Active', multiplier: 1.9 },
];

function bmiCategory(bmi: number): { label: string; color: 'danger' | 'warning' | 'good' | 'neutral' } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
  if (bmi < 25) return { label: 'Normal', color: 'good' };
  if (bmi < 30) return { label: 'Overweight', color: 'warning' };
  return { label: 'Obese', color: 'danger' };
}

export default function HealthScreen() {
  const colors = useColors();
  const padding = useScreenPadding();
  const { applyTdee } = usePrepper();

  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('35');
  const [weight, setWeight] = useState('80');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [height, setHeight] = useState('175');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<{ bmi: number; tdee: number } | null>(null);

  function calculate() {
    const ageN = parseInt(age, 10);
    const weightN = parseFloat(weight);
    const heightN = parseFloat(height);
    if (isNaN(ageN) || isNaN(weightN) || isNaN(heightN) || weightN <= 0 || heightN <= 0) return;

    const weightKg = weightUnit === 'lbs' ? weightN * 0.453592 : weightN;
    const heightCm = heightUnit === 'in' ? heightN * 2.54 : heightN;

    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    const bmr =
      gender === 'male'
        ? 10 * weightKg + 6.25 * heightCm - 5 * ageN + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * ageN - 161;

    const multiplier = ACTIVITY_OPTIONS.find((a) => a.key === activity)?.multiplier ?? 1.55;
    const tdee = bmr * multiplier;
    setResult({ bmi, tdee });
  }

  const cat = result ? bmiCategory(result.bmi) : null;
  const catColor = cat
    ? { good: colors.success, warning: colors.warning, danger: colors.danger, neutral: colors.primary }[cat.color]
    : colors.primary;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: padding.top, paddingBottom: padding.bottom, paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <PageTitle title="Health Tools" subtitle="BMI & calorie calculator" />
      {/* Gender */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>GENDER</Text>
        <View style={styles.toggle}>
          {(['male', 'female'] as Gender[]).map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.toggleBtn,
                { backgroundColor: gender === g ? colors.primary : colors.secondary, borderColor: colors.border },
              ]}
              onPress={() => setGender(g)}
              testID={`btn-gender-${g}`}
            >
              <Text style={[styles.toggleText, { color: gender === g ? colors.primaryForeground : colors.mutedForeground }]}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Age */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>AGE</Text>
        <TextInput
          style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Years"
          placeholderTextColor={colors.mutedForeground}
          testID="input-age"
        />
      </View>

      {/* Weight */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>WEIGHT</Text>
          <View style={styles.unitToggle}>
            {(['kg', 'lbs'] as WeightUnit[]).map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.unitBtn, { backgroundColor: weightUnit === u ? colors.primary : colors.secondary }]}
                onPress={() => setWeightUnit(u)}
                testID={`btn-weight-${u}`}
              >
                <Text style={[styles.unitText, { color: weightUnit === u ? colors.primaryForeground : colors.mutedForeground }]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder={weightUnit === 'kg' ? '80' : '176'}
          placeholderTextColor={colors.mutedForeground}
          testID="input-weight"
        />
      </View>

      {/* Height */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>HEIGHT</Text>
          <View style={styles.unitToggle}>
            {(['cm', 'in'] as HeightUnit[]).map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.unitBtn, { backgroundColor: heightUnit === u ? colors.primary : colors.secondary }]}
                onPress={() => setHeightUnit(u)}
                testID={`btn-height-${u}`}
              >
                <Text style={[styles.unitText, { color: heightUnit === u ? colors.primaryForeground : colors.mutedForeground }]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholder={heightUnit === 'cm' ? '175' : '69'}
          placeholderTextColor={colors.mutedForeground}
          testID="input-height"
        />
      </View>

      {/* Activity */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ACTIVITY LEVEL</Text>
        <View style={styles.activityList}>
          {ACTIVITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.activityRow,
                {
                  backgroundColor: activity === opt.key ? colors.accent : 'transparent',
                  borderColor: activity === opt.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setActivity(opt.key)}
              testID={`btn-activity-${opt.key}`}
            >
              <Text style={[styles.activityLabel, { color: activity === opt.key ? colors.accentForeground : colors.foreground }]}>
                {opt.label}
              </Text>
              <Text style={[styles.activityMult, { color: activity === opt.key ? colors.accentForeground : colors.mutedForeground }]}>
                ×{opt.multiplier}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Calculate */}
      <TouchableOpacity
        style={[styles.calcBtn, { backgroundColor: colors.primary }]}
        onPress={calculate}
        testID="btn-calculate"
      >
        <Feather name="cpu" size={16} color={colors.primaryForeground} />
        <Text style={[styles.calcBtnText, { color: colors.primaryForeground }]}>Calculate</Text>
      </TouchableOpacity>

      {/* Results */}
      {result && cat && (
        <View style={[styles.results, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>RESULTS</Text>
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>BMI</Text>
              <Text style={[styles.resultValue, { color: catColor }]}>{result.bmi.toFixed(1)}</Text>
              <View style={[styles.catBadge, { backgroundColor: catColor + '22', borderColor: catColor }]}>
                <Text style={[styles.catBadgeText, { color: catColor }]}>{cat.label}</Text>
              </View>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>Daily Calories</Text>
              <Text style={[styles.resultValue, { color: colors.primary }]}>{Math.round(result.tdee).toLocaleString()}</Text>
              <Text style={[styles.resultSub, { color: colors.mutedForeground }]}>cal / day (TDEE)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.applyBtn, { borderColor: colors.primary }]}
            onPress={() => applyTdee(result.tdee)}
            testID="btn-apply-tdee"
          >
            <Feather name="arrow-left" size={14} color={colors.primary} />
            <Text style={[styles.applyBtnText, { color: colors.primary }]}>
              Apply {Math.round(result.tdee / 10) * 10} cal to Dashboard
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { borderRadius: 10, borderWidth: 1, padding: 14, marginBottom: 10 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, fontWeight: '600' },
  toggle: { flexDirection: 'row', gap: 10 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  toggleText: { fontSize: 14, fontWeight: '600' },
  unitToggle: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', gap: 2 },
  unitBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  unitText: { fontSize: 12, fontWeight: '700' },
  activityList: { gap: 6 },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  activityLabel: { fontSize: 14, fontWeight: '500' },
  activityMult: { fontSize: 12 },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  calcBtnText: { fontSize: 16, fontWeight: '700' },
  results: { borderRadius: 10, borderWidth: 1, padding: 16, marginBottom: 16, gap: 16 },
  resultRow: { flexDirection: 'row', alignItems: 'center' },
  resultItem: { flex: 1, alignItems: 'center', gap: 4 },
  resultLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  resultValue: { fontSize: 36, fontWeight: '700', letterSpacing: -1 },
  resultSub: { fontSize: 11 },
  resultDivider: { width: 1, height: 60, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 8 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  catBadgeText: { fontSize: 11, fontWeight: '700' },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
  },
  applyBtnText: { fontSize: 14, fontWeight: '700' },
});
