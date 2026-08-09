import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { PantryItem } from '@/context/PrepperContext';
import { usePrepper } from '@/context/PrepperContext';

interface Props {
  item: PantryItem;
}

export function PantryItemRow({ item }: Props) {
  const colors = useColors();
  const { updateItemQty, setItemQty, deletePantryItem } = usePrepper();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.currentQty.toString());

  const progress = item.targetQty > 0 ? Math.min(item.currentQty / item.targetQty, 1) : 0;
  const progressColor = progress >= 1 ? colors.success : progress >= 0.5 ? colors.warning : colors.danger;

  function commitEdit() {
    const n = parseInt(draft, 10);
    setItemQty(item.id, isNaN(n) ? 0 : n);
    setEditing(false);
  }

  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.cal, { color: colors.mutedForeground }]}>{item.caloriesPerItem.toLocaleString()} cal / item</Text>
        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: progressColor }]} />
        </View>
        <Text style={[styles.target, { color: colors.mutedForeground }]}>
          {item.currentQty} / {item.targetQty} target
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.qtyBtn, { backgroundColor: colors.secondary }]}
          onPress={() => updateItemQty(item.id, -1)}
          testID={`btn-decrease-${item.id}`}
        >
          <Feather name="minus" size={14} color={colors.foreground} />
        </TouchableOpacity>
        {editing ? (
          <TextInput
            style={[styles.qtyInput, { color: colors.foreground, borderColor: colors.primary, backgroundColor: colors.input }]}
            value={draft}
            onChangeText={setDraft}
            onBlur={commitEdit}
            onSubmitEditing={commitEdit}
            keyboardType="numeric"
            autoFocus
            selectTextOnFocus
          />
        ) : (
          <TouchableOpacity onPress={() => { setDraft(item.currentQty.toString()); setEditing(true); }}>
            <Text style={[styles.qtyText, { color: colors.foreground }]}>{item.currentQty}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.qtyBtn, { backgroundColor: colors.secondary }]}
          onPress={() => updateItemQty(item.id, 1)}
          testID={`btn-increase-${item.id}`}
        >
          <Feather name="plus" size={14} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deletePantryItem(item.id)}
          testID={`btn-delete-${item.id}`}
        >
          <Feather name="trash-2" size={14} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  cal: {
    fontSize: 11,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  target: {
    fontSize: 10,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'center',
  },
  qtyInput: {
    fontSize: 15,
    fontWeight: '700',
    width: 42,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 2,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
});
