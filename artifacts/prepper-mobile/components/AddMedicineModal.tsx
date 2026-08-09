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
import type { MedicineCategory } from '@/context/PrepperContext';
import { usePrepper } from '@/context/PrepperContext';

const CATEGORIES: MedicineCategory[] = ['Prescription', 'Over Counter', 'Supplements'];

interface Props {
  visible: boolean;
  defaultCategory: MedicineCategory;
  onClose: () => void;
}

export function AddMedicineModal({ visible, defaultCategory, onClose }: Props) {
  const colors = useColors();
  const { addMedicineItem } = usePrepper();
  const [name, setName] = useState('');
  const [doses, setDoses] = useState('0');
  const [expiry, setExpiry] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState<MedicineCategory>(defaultCategory);

  function handleAdd() {
    if (!name.trim() || !target.trim()) return;
    addMedicineItem({
      name: name.trim(),
      doses: parseInt(doses, 10) || 0,
      expiry: expiry.trim(),
      targetAmount: parseInt(target, 10) || 1,
      category,
    });
    setName(''); setDoses('0'); setExpiry(''); setTarget('');
    setCategory(defaultCategory);
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
            <Text style={[styles.title, { color: colors.foreground }]}>Add Medicine</Text>
            <TouchableOpacity onPress={onClose} testID="btn-close-add-medicine">
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>CATEGORY</Text>
              <View style={styles.catRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catBtn,
                      {
                        backgroundColor: category === cat ? colors.primary : colors.secondary,
                        borderColor: category === cat ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setCategory(cat)}
                    testID={`btn-cat-${cat}`}
                  >
                    <Text
                      style={[
                        styles.catText,
                        { color: category === cat ? colors.primaryForeground : colors.mutedForeground },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.mutedForeground }]}>MEDICINE NAME</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Paracetamol"
                placeholderTextColor={colors.mutedForeground}
                testID="input-medicine-name"
              />

              <Text style={[styles.label, { color: colors.mutedForeground }]}>CURRENT DOSES</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={doses}
                onChangeText={setDoses}
                keyboardType="numeric"
                testID="input-medicine-doses"
              />

              <Text style={[styles.label, { color: colors.mutedForeground }]}>EXPIRY (MM/YYYY)</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={expiry}
                onChangeText={setExpiry}
                placeholder="e.g. 06/2027"
                placeholderTextColor={colors.mutedForeground}
                testID="input-medicine-expiry"
              />

              <Text style={[styles.label, { color: colors.mutedForeground }]}>TARGET AMOUNT (DOSES)</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.muted }]}
                value={target}
                onChangeText={setTarget}
                placeholder="e.g. 60"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                testID="input-medicine-target"
              />

              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.primary, opacity: !name.trim() || !target ? 0.5 : 1 }]}
                onPress={handleAdd}
                disabled={!name.trim() || !target}
                testID="btn-confirm-add-medicine"
              >
                <Text style={[styles.addBtnText, { color: colors.primaryForeground }]}>Add Medicine</Text>
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
    maxHeight: '90%',
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
  catRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  catBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  catText: { fontSize: 12, fontWeight: '600' },
  addBtn: { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  addBtnText: { fontSize: 16, fontWeight: '700' },
});
