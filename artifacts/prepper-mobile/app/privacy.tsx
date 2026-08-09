import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useScreenPadding } from '@/hooks/useScreenPadding';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: "Prepper's Companion stores your pantry, medicine, and health tracking data entirely on your own device. We do not collect, transmit, or store any of this data on external servers — the App has no backend, and nothing you enter ever leaves your device.",
  },
  {
    title: 'How We Use Information',
    body: "Any data you enter into the App (pantry items, medicine tracking, health calculator inputs) is used solely to provide the App's core functionality, locally on your device.",
  },
  {
    title: 'Data Sharing',
    body: 'We do not collect, sell, trade, or share your personal information with any third parties, because we do not have access to it in the first place.',
  },
  {
    title: 'Data Storage & Security',
    body: "All data is stored locally on your device using your device's local storage. It is not backed up to any cloud service by the App. If you uninstall the App, this information will be permanently deleted.",
  },
  {
    title: "Children's Privacy",
    body: "Prepper's Companion is not directed at children under 13, and we do not knowingly collect personal information from children, as the App does not collect personal information from anyone.",
  },
  {
    title: 'Your Choices',
    body: 'You can delete your stored data at any time using the "Clear Pantry" and "Clear Medicines" options within the App\'s Settings.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Changes will be posted with an updated revision date.',
  },
];

export default function PrivacyScreen() {
  const colors = useColors();
  const padding = useScreenPadding();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: 24, paddingBottom: padding.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={[styles.badgeWrap, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '50' }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>LEGAL</Text>
        </View>
        <Text style={[styles.heroTitle, { color: colors.foreground }]}>Privacy Policy</Text>
        <Text style={[styles.heroDate, { color: colors.mutedForeground }]}>Last updated: August 7, 2026</Text>
      </View>

      {/* Intro highlight */}
      <View style={[styles.highlight, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: colors.primary }]}>
        <Text style={[styles.highlightText, { color: colors.foreground }]}>
          Prepper's Companion ("the App") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our app.
        </Text>
      </View>

      {/* Policy sections */}
      <View style={styles.sections}>
        {SECTIONS.map((section) => (
          <View
            key={section.title}
            style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.accent, { backgroundColor: colors.primary }]} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section.title}</Text>
            </View>
            <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>{section.body}</Text>
          </View>
        ))}
      </View>

      {/* Contact */}
      <View style={styles.contactWrap}>
        <Text style={[styles.contactHeading, { color: colors.foreground }]}>Contact Us</Text>
        <Text style={[styles.contactSub, { color: colors.mutedForeground }]}>
          If you have questions about this Privacy Policy, contact us at:
        </Text>
        <TouchableOpacity
          style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Linking.openURL('mailto:ukurbanprepper@gmail.com')}
          activeOpacity={0.7}
        >
          <View style={[styles.contactIcon, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="mail" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.contactLabel, { color: colors.mutedForeground }]}>Email address</Text>
            <Text style={[styles.contactEmail, { color: colors.foreground }]}>ukurbanprepper@gmail.com</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} style={styles.contactChevron} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: { paddingHorizontal: 16, marginBottom: 20 },
  badgeWrap: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, marginBottom: 6 },
  heroDate: { fontSize: 12, fontFamily: 'monospace' },

  // Highlight
  highlight: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 3,
  },
  highlightText: { fontSize: 14, lineHeight: 22 },

  // Sections
  sections: { paddingHorizontal: 16, gap: 12, marginBottom: 28 },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  accent: { width: 3, height: 18, borderRadius: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  sectionBody: { fontSize: 14, lineHeight: 22 },

  // Contact
  contactWrap: { paddingHorizontal: 16, marginBottom: 8 },
  contactHeading: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  contactSub: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: { fontSize: 11, marginBottom: 2 },
  contactEmail: { fontSize: 14, fontWeight: '600' },
  contactChevron: { marginLeft: 'auto' },
});
