/**
 * Design tokens for Prepper's Companion — synced from sibling web artifact (prepper-app).
 * Dark mode: deep charcoal + muted olive green primary.
 */
const colors = {
  light: {
    text: '#0a0a0a',
    tint: '#566E3C',
    background: '#F5F7FA',
    foreground: '#111827',
    card: '#FFFFFF',
    cardForeground: '#111827',
    primary: '#566E3C',
    primaryForeground: '#FFFFFF',
    secondary: '#F0F4F8',
    secondaryForeground: '#111827',
    muted: '#F0F4F8',
    mutedForeground: '#6B7280',
    accent: '#3E5228',
    accentForeground: '#FFFFFF',
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    border: '#E2E8F0',
    input: '#E2E8F0',
    warning: '#D97706',
    danger: '#DC2626',
    success: '#4A6830',
  },
  dark: {
    // Synced from prepper-app/src/index.css .dark block
    text: '#E8EDF3',           // hsl(210, 20%, 92%)
    tint: '#566E3C',
    background: '#0D1017',    // hsl(222, 24%, 7%)
    foreground: '#E8EDF3',
    card: '#141923',           // hsl(218, 22%, 11%)
    cardForeground: '#E8EDF3',
    primary: '#566E3C',        // hsl(78, 28%, 38%) — muted olive green
    primaryForeground: '#0D1017',
    secondary: '#232C39',      // hsl(215, 20%, 18%)
    secondaryForeground: '#E8EDF3',
    muted: '#1C2330',          // hsl(215, 20%, 16%)
    mutedForeground: '#7E8FA4', // hsl(215, 15%, 58%)
    accent: '#3E5228',         // hsl(78, 25%, 32%)
    accentForeground: '#E8EDF3',
    destructive: '#C03030',    // hsl(0, 62%, 50%)
    destructiveForeground: '#F5F9FC',
    border: '#232C39',
    input: '#283244',          // hsl(215, 20%, 22%)
    warning: '#C8894A',        // amber
    danger: '#C03030',         // red
    success: '#566E3C',        // olive green
  },
  radius: 6,
};

export type Colors = typeof colors.dark;
export default colors;
