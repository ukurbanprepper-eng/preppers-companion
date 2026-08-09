import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function PrepperHeader() {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      {/* Green shield badge */}
      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
        <Feather name="shield" size={16} color={colors.primaryForeground} />
      </View>
      <View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Prepper's Companion
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Emergency Readiness Tool
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    borderRadius: 7,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 1,
    letterSpacing: 0.2,
  },
});
