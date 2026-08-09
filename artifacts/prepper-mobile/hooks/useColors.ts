import colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

/**
 * Returns the colour palette matching the current theme mode.
 * Defaults to dark; switches when the user selects light in Settings.
 */
export function useColors() {
  const { themeMode } = useTheme();
  return { ...colors[themeMode], radius: colors.radius };
}
