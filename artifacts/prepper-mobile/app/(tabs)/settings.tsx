import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useTheme } from '@/context/ThemeContext';
import { usePrepper } from '@/context/PrepperContext';
import { PageTitle } from '@/components/PageTitle';
import { useScreenPadding } from '@/hooks/useScreenPadding';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ visible, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  const colors = useColors();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.dialogIconWrap, { backgroundColor: colors.danger + '20' }]}>
            <Feather name="alert-triangle" size={22} color={colors.danger} />
          </View>
          <Text style={[styles.dialogTitle, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.dialogMessage, { color: colors.mutedForeground }]}>{message}</Text>
          <View style={styles.dialogButtons}>
            <TouchableOpacity
              style={[styles.dialogBtn, styles.dialogBtnCancel, { borderColor: colors.border }]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.dialogBtnText, { color: colors.foreground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogBtn, styles.dialogBtnConfirm, { backgroundColor: colors.danger }]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.dialogBtnText, { color: '#fff' }]}>Yes, clear all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { themeMode, setThemeMode } = useTheme();
  const { clearPantry, clearMedicines } = usePrepper();
  const padding = useScreenPadding();

  const router = useRouter();
  const [confirmTarget, setConfirmTarget] = useState<'pantry' | 'medicines' | null>(null);

  function handleConfirm() {
    if (confirmTarget === 'pantry') clearPantry();
    if (confirmTarget === 'medicines') clearMedicines();
    setConfirmTarget(null);
  }

  const isDark = themeMode === 'dark';

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: padding.top, paddingBottom: padding.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageTitleWrap}>
          <PageTitle title="Settings" subtitle="App preferences and data" />
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrap, { backgroundColor: colors.primary + '20' }]}>
                  <Feather name={isDark ? 'moon' : 'sun'} size={16} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.rowTitle, { color: colors.foreground }]}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                  <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>
                    Currently using {isDark ? 'dark' : 'light'} theme
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? colors.primaryForeground : colors.mutedForeground}
                testID="switch-dark-mode"
              />
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DATA MANAGEMENT</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Clear Pantry */}
            <TouchableOpacity
              style={[styles.row, styles.rowBorder, { borderColor: colors.border }]}
              onPress={() => setConfirmTarget('pantry')}
              activeOpacity={0.7}
              testID="btn-clear-pantry"
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrap, { backgroundColor: colors.danger + '20' }]}>
                  <Feather name="trash-2" size={16} color={colors.danger} />
                </View>
                <View>
                  <Text style={[styles.rowTitle, { color: colors.foreground }]}>Clear Pantry</Text>
                  <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>
                    Remove all food items
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>

            {/* Clear Medicines */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => setConfirmTarget('medicines')}
              activeOpacity={0.7}
              testID="btn-clear-medicines"
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrap, { backgroundColor: colors.danger + '20' }]}>
                  <Feather name="trash-2" size={16} color={colors.danger} />
                </View>
                <View>
                  <Text style={[styles.rowTitle, { color: colors.foreground }]}>Clear Medicines</Text>
                  <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>
                    Remove all medicine items
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>LEGAL</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push('/privacy')}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconWrap, { backgroundColor: colors.primary + '20' }]}>
                  <Feather name="shield" size={16} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.rowTitle, { color: colors.foreground }]}>Privacy Policy</Text>
                  <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>
                    How we handle your data
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmTarget !== null}
        title={`Clear ${confirmTarget === 'pantry' ? 'Pantry' : 'Medicines'}?`}
        message={`You will lose all ${confirmTarget === 'pantry' ? 'pantry food items' : 'medicine items'}. Are you sure you want to do this?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitleWrap: { paddingHorizontal: 16 },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
  },
  // Confirm dialog
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  dialogIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  dialogBtnCancel: {
    borderWidth: 1,
  },
  dialogBtnConfirm: {},
  dialogBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
