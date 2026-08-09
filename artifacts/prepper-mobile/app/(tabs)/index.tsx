import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { usePrepper } from '@/context/PrepperContext';
import { StatCard } from '@/components/StatCard';
import { PageTitle } from '@/components/PageTitle';
import { useScreenPadding } from '@/hooks/useScreenPadding';

function getStatus(days: number, threshLow: number, threshHigh: number): 'danger' | 'warning' | 'good' {
  if (days < threshLow) return 'danger';
  if (days < threshHigh) return 'warning';
  return 'good';
}

function NumberInput({
  label,
  value,
  onChangeText,
  suffix,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  suffix?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.numInputWrap}>
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.inputRow, { borderColor: colors.input, backgroundColor: colors.muted }]}>
        <TextInput
          style={[styles.numInput, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          selectTextOnFocus
        />
        {suffix ? <Text style={[styles.suffix, { color: colors.mutedForeground }]}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const {
    numPeople,
    caloriesPerPerson,
    litresPerPersonPerDay,
    totalLitresStored,
    totalCaloriesStored,
    daysOfFoodRemaining,
    daysOfWaterRemaining,
    setNumPeople,
    setCaloriesPerPerson,
    setLitresPerPersonPerDay,
    setTotalLitresStored,
  } = usePrepper();

  const dailyCaloriesNeeded = numPeople * caloriesPerPerson;
  const foodStatus = getStatus(daysOfFoodRemaining, 7, 30);
  const waterStatus = getStatus(daysOfWaterRemaining, 3, 14);

  const padding = useScreenPadding();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: padding.top, paddingBottom: padding.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <PageTitle title="Dashboard" subtitle="Readiness overview" />
        {/* Big primary metrics */}
        <View style={styles.bigRow}>
          <View style={styles.bigCard}>
            <StatCard
              label="DAYS OF FOOD"
              value={isFinite(daysOfFoodRemaining) ? daysOfFoodRemaining.toFixed(1) : '—'}
              unit="days"
              status={foodStatus}
              subtitle={`${totalCaloriesStored.toLocaleString()} cal stored`}
              large
            />
          </View>
          <View style={styles.bigCard}>
            <StatCard
              label="DAYS OF WATER"
              value={isFinite(daysOfWaterRemaining) ? daysOfWaterRemaining.toFixed(1) : '—'}
              unit="days"
              status={waterStatus}
              subtitle={`${totalLitresStored}L stored`}
              large
            />
          </View>
        </View>

        {/* Household Configuration */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>HOUSEHOLD CONFIGURATION</Text>
          <View style={styles.row2}>
            <View style={styles.half}>
              <NumberInput
                label="People"
                value={numPeople.toString()}
                onChangeText={(v) => setNumPeople(parseInt(v, 10) || 1)}
              />
            </View>
            <View style={styles.half}>
              <NumberInput
                label="Cal / Person / Day"
                value={caloriesPerPerson.toString()}
                onChangeText={(v) => setCaloriesPerPerson(parseInt(v, 10) || 1)}
                suffix="cal"
              />
            </View>
          </View>
        </View>

        {/* Food breakdown */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>FOOD SUPPLY STATUS</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Total Stored</Text>
              <Text style={[styles.metaValue, { color: colors.foreground }]}>{totalCaloriesStored.toLocaleString()} cal</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Daily Needed</Text>
              <Text style={[styles.metaValue, { color: colors.foreground }]}>{dailyCaloriesNeeded.toLocaleString()} cal</Text>
            </View>
          </View>
        </View>

        {/* Water Calculator */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>WATER CALCULATOR</Text>
          <View style={styles.row2}>
            <View style={styles.half}>
              <NumberInput
                label="Litres / Person / Day"
                value={litresPerPersonPerDay.toString()}
                onChangeText={(v) => {
                  const n = parseFloat(v);
                  if (!isNaN(n)) setLitresPerPersonPerDay(n);
                }}
                suffix="L"
              />
            </View>
            <View style={styles.half}>
              <NumberInput
                label="Total Stored"
                value={totalLitresStored.toString()}
                onChangeText={(v) => setTotalLitresStored(parseFloat(v) || 0)}
                suffix="L"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { paddingHorizontal: 16, gap: 12 },
  bigRow: { flexDirection: 'row', gap: 12 },
  bigCard: { flex: 1 },
  section: { borderRadius: 10, borderWidth: 1, padding: 16 },
  sectionTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 12 },
  row2: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  numInputWrap: { gap: 4 },
  inputLabel: { fontSize: 11, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  numInput: { flex: 1, fontSize: 16, fontWeight: '600', padding: 0 },
  suffix: { fontSize: 13 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaItem: { flex: 1, gap: 2 },
  metaLabel: { fontSize: 11 },
  metaValue: { fontSize: 18, fontWeight: '700' },
  metaDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16 },
});
