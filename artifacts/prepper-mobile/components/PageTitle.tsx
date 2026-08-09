import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: Props) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
    letterSpacing: 0.2,
  },
});
