import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { PageTitle } from '@/components/PageTitle';
import { useScreenPadding } from '@/hooks/useScreenPadding';
import { usePrepper } from '@/context/PrepperContext';
import type { MedicineCategory } from '@/context/PrepperContext';
import { MedicineItemRow } from '@/components/MedicineItemRow';
import { AddMedicineModal } from '@/components/AddMedicineModal';

const CATEGORIES: MedicineCategory[] = ['Prescription', 'Over Counter', 'Supplements'];

export default function MedicinesScreen() {
  const colors = useColors();
  const { medicines } = usePrepper();
  const [modalCategory, setModalCategory] = useState<MedicineCategory | null>(null);

  const padding = useScreenPadding();

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: padding.top, paddingBottom: padding.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageTitleWrap}>
          <PageTitle title="Medicines" subtitle="Doses & expiry by category" />
        </View>
        {CATEGORIES.map((cat) => {
          const items = medicines.filter((i) => i.category === cat);
          return (
            <View key={cat} style={styles.categoryBlock}>
              <View style={[styles.catHeader, { borderColor: colors.border }]}>
                <Text style={[styles.catTitle, { color: colors.foreground }]}>{cat}</Text>
                <Text style={[styles.catCount, { color: colors.mutedForeground }]}>
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {items.length === 0 ? (
                  <Text style={[styles.empty, { color: colors.mutedForeground }]}>No items yet</Text>
                ) : (
                  items.map((item) => <MedicineItemRow key={item.id} item={item} />)
                )}
                <TouchableOpacity
                  style={[styles.addRow, { borderColor: colors.border }]}
                  onPress={() => setModalCategory(cat)}
                  testID={`btn-add-med-${cat}`}
                >
                  <Feather name="plus" size={14} color={colors.primary} />
                  <Text style={[styles.addText, { color: colors.primary }]}>Add {cat} medicine</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {modalCategory && (
        <AddMedicineModal
          visible
          defaultCategory={modalCategory}
          onClose={() => setModalCategory(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitleWrap: { paddingHorizontal: 16 },
  categoryBlock: { marginBottom: 16, paddingHorizontal: 16 },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  catTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  catCount: { fontSize: 11 },
  card: { borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  empty: { padding: 16, fontSize: 13, textAlign: 'center', fontStyle: 'italic' },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  addText: { fontSize: 13, fontWeight: '600' },
});
