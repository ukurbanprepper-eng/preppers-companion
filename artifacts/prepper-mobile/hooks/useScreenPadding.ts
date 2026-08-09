import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT_NATIVE = 49; // standard tab bar height before safe area
const TAB_BAR_HEIGHT_WEB = 84;   // matches the height set in _layout.tsx
const HEADER_HEIGHT_WEB = 67;    // matches the sticky header height on web

/**
 * Returns top and bottom contentContainerStyle padding values that correctly
 * account for the sticky header (web) and the floating tab bar (all platforms).
 */
export function useScreenPadding(extraBottom = 24) {
  const insets = useSafeAreaInsets();

  const top = Platform.OS === 'web' ? HEADER_HEIGHT_WEB + 16 : 16;
  const bottom =
    Platform.OS === 'web'
      ? TAB_BAR_HEIGHT_WEB + extraBottom
      : TAB_BAR_HEIGHT_NATIVE + insets.bottom + extraBottom;

  return { top, bottom };
}
