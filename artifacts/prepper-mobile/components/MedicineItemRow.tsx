import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { MedicineItem } from '@/context/PrepperContext';
import { usePrepper } from '@/context/PrepperContext';

interface Props {
  item: MedicineItem;
}

function expiryStatus(expiry: string): 'expired' | 'soon' | 'ok' {
  if (!expiry || !expiry.includes('/')) return 'ok';
  const [mm, yyyy] = expiry.split('/');
  const month = parseInt(mm, 10);
  const year = parseInt(yyyy, 10);
  if (isNaN(month) || isNaN(year)) return 'ok';
  const expiryDate = new Date(year, month - 1 + 1, 0); // last day of that month
  const now = new Date();
  const threeMonths = new Date();
  threeMonths.setMonth(threeMonths.getMonth() + 3);
  if (expiryDate < now) return 'expired';
  if (expiryDate < threeMonths) return 'soon';
  return 'ok';
}

export function MedicineItemRow({ item }: Props) {
  const colors = useColors();
  const { updateMedicineDoses, setMedicineDoses, deleteMedicineItem } = usePrepper();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.doses.toString());

  const progress = item.targetAmount > 0 ? Math.min(item.doses / item.targetAmount, 1) : 0;
  const progressColor = progress >= 1 ? colors.success : progress >= 0.5 ? colors.warning : colors.danger;

  const expStatus = expiryStatus(item.expiry);
  const expiryColor =
    expStatus === 'expired' ? colors.danger :
    expStatus === 'soon' ? colors.warning :
    colors.mutedForeground;
  const expiryLabel =
    expStatus === 'expired' ? `Expired ${item.expiry}` :
    expStatus === 'soon' ? `Exp ${item.expiry} — soon` :
    `Exp ${item.expiry}`;

  function commitEdit() {
    const n = parseInt(draft, 10);
    setMedicineDoses(item.id, isNaN(n) ? 0 : n);
    setEditing(false);
  }

  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.expiry, { color: expiryColor }]}>{expiryLabel}</Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: progressColor }]} />
        </View>
        <Text style={[styles.target, { color: colors.mutedForeground }]}>
          {item.doses} / {item.targetAmount} doses target
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.qtyBtn, { backgroundColor: colors.secondary }]}
          onPress={() => updateMedicineDoses(item.id, -1)}
          testID={`btn-decrease-med-${item.id}`}
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
          <TouchableOpacity onPress={() => { setDraft(item.doses.toString()); setEditing(true); }}>
            <Text style={[styles.qtyText, { color: colors.foreground }]}>{item.doses}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.qtyBtn, { backgroundColor: colors.secondary }]}
          onPress={() => updateMedicineDoses(item.id, 1)}
          testID={`btn-increase-med-${item.id}`}
        >
          <Feather name="plus" size={14} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteMedicineItem(item.id)}
          testID={`btn-delete-med-${item.id}`}
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
  expiry: {
    fontSize: 11,
    fontWeight: '500',
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
