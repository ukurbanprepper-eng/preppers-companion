import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { usePrepper } from '@/context/PrepperContext';
import type { PantryCategory, PantryItem } from '@/context/PrepperContext';
import { PantryItemRow } from '@/components/PantryItemRow';
import { AddItemModal } from '@/components/AddItemModal';
import { PageTitle } from '@/components/PageTitle';
import { useScreenPadding } from '@/hooks/useScreenPadding';

const CATEGORIES: PantryCategory[] = ['Tinned', 'Dried', 'Freeze-Dried', 'Other'];

function normaliseCategory(raw: string): PantryCategory {
  const s = raw.trim().toLowerCase();
  if (s === 'tinned' || s === 'canned') return 'Tinned';
  if (s === 'dried' || s === 'dry') return 'Dried';
  if (s === 'freeze-dried' || s === 'freeze dried') return 'Freeze-Dried';
  return 'Other';
}

function parseCSV(text: string): { items: Omit<PantryItem, 'id'>[]; errors: string[] } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: Omit<PantryItem, 'id'>[] = [];
  const errors: string[] = [];
  const startIdx = lines[0]?.toLowerCase().includes('name') ? 1 : 0;
  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
    if (parts.length < 4) {
      errors.push(`Row ${i + 1}: need name,calories,current,target[,category]`);
      continue;
    }
    const [name, calsRaw, currRaw, targetRaw, catRaw = 'other'] = parts;
    if (!name) { errors.push(`Row ${i + 1}: missing name`); continue; }
    const caloriesPerItem = parseInt(calsRaw, 10);
    const currentQty = parseInt(currRaw, 10);
    const targetQty = parseInt(targetRaw, 10);
    if (isNaN(caloriesPerItem) || isNaN(currentQty) || isNaN(targetQty)) {
      errors.push(`Row ${i + 1}: calories, current and target must be numbers`);
      continue;
    }
    items.push({ name, caloriesPerItem, currentQty, targetQty, category: normaliseCategory(catRaw) });
  }
  return { items, errors };
}

interface CSVImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (items: Omit<PantryItem, 'id'>[], errors: string[]) => void;
}

function CSVImportModal({ visible, onClose, onImport }: CSVImportModalProps) {
  const colors = useColors();
  const [csvText, setCsvText] = useState('');

  function handleImport() {
    const { items, errors } = parseCSV(csvText);
    onImport(items, errors);
    setCsvText('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.modalHandle} />
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>Import Pantry CSV</Text>
          <Text style={[styles.modalHint, { color: colors.mutedForeground }]}>
            Paste CSV data below. Format:{'\n'}
            <Text style={{ color: colors.foreground, fontFamily: 'monospace' }}>
              name, calories, currentQty, targetQty, category
            </Text>
            {'\n'}Category: Tinned | Dried | Freeze-Dried | Other
          </Text>
          <TextInput
            style={[
              styles.csvInput,
              { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border },
            ]}
            multiline
            numberOfLines={8}
            placeholder={'Baked Beans,300,12,24,Tinned\nWhite Rice,3500,4,10,Dried'}
            placeholderTextColor={colors.mutedForeground}
            value={csvText}
            onChangeText={setCsvText}
            autoCorrect={false}
            autoCapitalize="none"
            testID="input-csv-text"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { borderColor: colors.border, borderWidth: 1 }]}
              onPress={() => { setCsvText(''); onClose(); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalBtnText, { color: colors.foreground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              onPress={handleImport}
              disabled={!csvText.trim()}
              activeOpacity={0.7}
              testID="btn-csv-import-confirm"
            >
              <Text style={[styles.modalBtnText, { color: colors.primaryForeground }]}>Import</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function PantryScreen() {
  const colors = useColors();
  const { pantry, addPantryItem } = usePrepper();
  const [modalCategory, setModalCategory] = useState<PantryCategory | null>(null);
  const [csvModalVisible, setCSVModalVisible] = useState(false);
  const [importBanner, setImportBanner] = useState<{ imported: number; errors: number } | null>(null);
  const padding = useScreenPadding();

  function handleCSVImport(items: Omit<PantryItem, 'id'>[], errors: string[]) {
    items.forEach((item) => addPantryItem(item));
    setImportBanner({ imported: items.length, errors: errors.length });
    setTimeout(() => setImportBanner(null), 4000);
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: padding.top, paddingBottom: padding.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageTitleWrap}>
          <PageTitle title="Pantry" subtitle="Food stores by category" />
        </View>

        {/* CSV import button */}
        <View style={styles.csvRow}>
          <TouchableOpacity
            style={[styles.csvBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => setCSVModalVisible(true)}
            activeOpacity={0.7}
            testID="btn-import-csv"
          >
            <Feather name="upload" size={14} color={colors.primary} />
            <Text style={[styles.csvBtnText, { color: colors.primary }]}>Import CSV</Text>
          </TouchableOpacity>
        </View>

        {/* Import result banner */}
        {importBanner && (
          <View style={[styles.banner, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
            <Feather name="check-circle" size={14} color={colors.primary} />
            <Text style={[styles.bannerText, { color: colors.primary }]}>
              {importBanner.imported} item{importBanner.imported !== 1 ? 's' : ''} imported
              {importBanner.errors > 0 ? `, ${importBanner.errors} row${importBanner.errors !== 1 ? 's' : ''} skipped` : ''}
            </Text>
          </View>
        )}

        {CATEGORIES.map((cat) => {
          const items = pantry.filter((i) => i.category === cat);
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
                  items.map((item) => <PantryItemRow key={item.id} item={item} />)
                )}
                <TouchableOpacity
                  style={[styles.addRow, { borderColor: colors.border }]}
                  onPress={() => setModalCategory(cat)}
                  testID={`btn-add-${cat}`}
                >
                  <Feather name="plus" size={14} color={colors.primary} />
                  <Text style={[styles.addText, { color: colors.primary }]}>Add {cat} item</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {modalCategory && (
        <AddItemModal
          visible
          category={modalCategory}
          onClose={() => setModalCategory(null)}
        />
      )}

      <CSVImportModal
        visible={csvModalVisible}
        onClose={() => setCSVModalVisible(false)}
        onImport={handleCSVImport}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitleWrap: { paddingHorizontal: 16 },
  csvRow: { paddingHorizontal: 16, marginBottom: 8 },
  csvBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  csvBtnText: { fontSize: 13, fontWeight: '600' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  bannerText: { fontSize: 13, fontWeight: '500' },
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
  // CSV Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#555',
    alignSelf: 'center',
    marginBottom: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalHint: { fontSize: 12, lineHeight: 18 },
  csvInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    fontSize: 12,
    fontFamily: 'monospace',
    minHeight: 140,
    textAlignVertical: 'top',
  },
  modalButtons: { flexDirection: 'row', gap: 10 },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 15, fontWeight: '600' },
});
