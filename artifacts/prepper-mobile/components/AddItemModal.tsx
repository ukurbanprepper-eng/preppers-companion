import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { PantryCategory } from '@/context/PrepperContext';
import { usePrepper } from '@/context/PrepperContext';

interface Props {
  visible: boolean;
  category: PantryCategory;
  onClose: () => void;
}

export function AddItemModal({ visible, category, onClose }: Props) {
  const colors = useColors();
  const { addPantryItem } = usePrepper();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [qty, setQty] = useState('0');
  const [target, setTarget] = useState('');

  function handleAdd() {
    if (!name.trim() || !calories.trim() || !target.trim()) return;
    addPantryItem({
      name: name.trim(),
      caloriesPerItem: parseInt(calories, 10) || 0,
      currentQty: parseInt(qty, 10) || 0,
      targetQty: parseInt(target, 10) || 1,
      category,
    });
    setName(''); setCalories(''); setQty('0'); setTarget('');
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>Add {category} Item</Text>
            <TouchableOpacity onPress={onClose} testID="btn-close-add-item">
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>ITEM NAME</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Kidney Beans"
                placeholderTextColor={colors.mutedForeground}
                testID="input-item-name"
              />
              <Text style={[styles.label, { color: colors.mutedForeground }]}>CALORIES PER ITEM</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={calories}
                onChangeText={setCalories}
                placeholder="e.g. 250"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                testID="input-item-calories"
              />
              <Text style={[styles.label, { color: colors.mutedForeground }]}>CURRENT QUANTITY</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric"
                testID="input-item-qty"
              />
              <Text style={[styles.label, { color: colors.mutedForeground }]}>TARGET QUANTITY</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={target}
                onChangeText={setTarget}
                placeholder="e.g. 24"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                testID="input-item-target"
              />
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.primary, opacity: !name.trim() || !calories || !target ? 0.5 : 1 }]}
                onPress={handleAdd}
                disabled={!name.trim() || !calories || !target}
                testID="btn-confirm-add-item"
              >
                <Text style={[styles.addBtnText, { color: colors.primaryForeground }]}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  title: { fontSize: 17, fontWeight: '700' },
  form: { paddingHorizontal: 20, gap: 6 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, marginTop: 4 },
  addBtn: { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  addBtnText: { fontSize: 16, fontWeight: '700' },
});
