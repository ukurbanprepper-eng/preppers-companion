import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  status: 'good' | 'warning' | 'danger' | 'neutral';
  subtitle?: string;
  large?: boolean;
}

export function StatCard({ label, value, unit, status, subtitle, large }: StatCardProps) {
  const colors = useColors();

  const statusColor = {
    good: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    neutral: colors.primary,
  }[status];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: statusColor }]}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={styles.row}>
        <Text style={[large ? styles.valueLarge : styles.value, { color: statusColor }]}>{value}</Text>
        {unit ? <Text style={[styles.unit, { color: colors.mutedForeground }]}> {unit}</Text> : null}
      </View>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 3,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  valueLarge: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2,
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    paddingBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
  },
});
