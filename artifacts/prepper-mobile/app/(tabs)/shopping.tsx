import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { usePrepper } from '@/context/PrepperContext';
import { useScreenPadding } from '@/hooks/useScreenPadding';

interface ShoppingEntry {
  id: string;
  name: string;
  category: string;
  needed: number;
  type: 'food' | 'medicine';
}

export default function ShoppingScreen() {
  const colors = useColors();
  const { pantry, medicines } = usePrepper();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const foodItems: ShoppingEntry[] = pantry
    .filter((i) => i.currentQty < i.targetQty)
    .map((i) => ({ id: i.id, name: i.name, category: i.category, needed: i.targetQty - i.currentQty, type: 'food' }));

  const medItems: ShoppingEntry[] = medicines
    .filter((i) => i.doses < i.targetAmount)
    .map((i) => ({ id: i.id, name: i.name, category: i.category, needed: i.targetAmount - i.doses, type: 'medicine' }));

  const allItems: ShoppingEntry[] = [...foodItems, ...medItems];

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const padding = useScreenPadding();

  if (allItems.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background, paddingTop: padding.top }]}>
        <Feather name="check-circle" size={48} color={colors.success} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>All Stocked Up</Text>
        <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
          Every item meets its target. Nothing to buy.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: padding.top, paddingBottom: padding.bottom, paddingHorizontal: 16 }}
      data={allItems}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>Shopping List</Text>
          <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>Items below target quantity</Text>
          <Text style={[styles.listHeader, { color: colors.mutedForeground }]}>
            {allItems.length} item{allItems.length !== 1 ? 's' : ''} to restock
          </Text>
        </>
      }
      renderItem={({ item }) => {
        const isChecked = checked.has(item.id);
        return (
          <TouchableOpacity
            style={[
              styles.row,
              {
                backgroundColor: isChecked ? colors.muted : colors.card,
                borderColor: colors.border,
                opacity: isChecked ? 0.5 : 1,
              },
            ]}
            onPress={() => toggleCheck(item.id)}
            activeOpacity={0.7}
            testID={`shopping-item-${item.id}`}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: isChecked ? colors.primary : colors.border,
                  backgroundColor: isChecked ? colors.primary : 'transparent',
                },
              ]}
            >
              {isChecked && <Feather name="check" size={12} color={colors.primaryForeground} />}
            </View>
            <View style={styles.itemInfo}>
              <Text
                style={[styles.itemName, { color: colors.foreground, textDecorationLine: isChecked ? 'line-through' : 'none' }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View style={styles.tagRow}>
                <View
                  style={[
                    styles.catTag,
                    { backgroundColor: item.type === 'medicine' ? colors.accent : colors.secondary },
                  ]}
                >
                  <Text style={[styles.catTagText, { color: item.type === 'medicine' ? colors.accentForeground : colors.mutedForeground }]}>
                    {item.category}
                  </Text>
                </View>
                {item.type === 'medicine' && (
                  <View style={[styles.typeTag, { backgroundColor: colors.muted }]}>
                    <Feather name="plus-circle" size={10} color={colors.mutedForeground} />
                    <Text style={[styles.typeTagText, { color: colors.mutedForeground }]}>Medicine</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={[styles.needed, { color: colors.primary }]}>
              Need {item.needed}
            </Text>
          </TouchableOpacity>
        );
      }}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: 30, marginBottom: 3 },
  pageSubtitle: { fontSize: 12, letterSpacing: 0.2, marginBottom: 16 },
  listHeader: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, fontWeight: '600' },
  tagRow: { flexDirection: 'row', gap: 6 },
  catTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  catTagText: { fontSize: 10, fontWeight: '600' },
  typeTag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  typeTagText: { fontSize: 10, fontWeight: '600' },
  needed: { fontSize: 13, fontWeight: '700' },
});
