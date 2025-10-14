// Color constants for the application
export const colors = {
  // Primary Colors
  primary: '#ff7f50',
  primaryLight: '#fff0e6',

  // Background Colors
  background: '#fffaf2',
  white: '#fff',
  black: '#000',

  // Text Colors
  textPrimary: '#333',
  textSecondary: '#666',
  textTertiary: '#777',
  textLight: '#888',
  textDark: '#444',
  textWhite: '#ffffff',

  // Border Colors
  border: '#eee',
  borderLight: '#ddd',
  borderMedium: '#e9ecef',
  borderDark: '#f5f5f5',

  // Gray Scale
  gray50: '#fafafa',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#ddd',
  gray400: '#ccc',

  // Status Colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',

  // Transparent Colors
  overlay: 'rgba(0,0,0,0.45)',
  overlayLight: 'rgba(0,0,0,0.3)',
  overlayDark: 'rgba(0,0,0,0.6)',
  overlayMedium: 'rgba(0,0,0,0.5)',

  // White Transparent
  whiteOverlay: 'rgba(255,255,255,0.7)',
  whiteOverlayLight: 'rgba(255, 255, 255, 0.05)',
  whiteOverlayMedium: 'rgba(255, 255, 255, 0.08)',
  whiteOverlayStrong: 'rgba(255, 255, 255, 0.1)',
  whiteOverlayVeryStrong: 'rgba(255, 255, 255, 0.3)',
  whiteOverlayAlmostOpaque: 'rgba(255, 255, 255, 0.9)',
  whiteOverlayOpaque: 'rgba(255, 255, 255, 0.95)',

  // Shadow Colors
  shadow: '#000',
  shadowText: 'rgba(0, 0, 0, 0.3)',

  // Special Colors
  avatar: '#ffefd9',
  rating: '#ffb74d',

  // Button States
  buttonDisabled: '#e9ecef',
  buttonSecondary: '#f0f0f0',
} as const;

// Color aliases for semantic usage
export const semanticColors = {
  // Backgrounds
  screenBackground: colors.background,
  cardBackground: colors.white,
  modalBackground: colors.white,
  inputBackground: colors.gray100,

  // Text
  primaryText: colors.textPrimary,
  secondaryText: colors.textSecondary,
  placeholderText: colors.textTertiary,
  whiteText: colors.textWhite,

  // Buttons
  primaryButton: colors.primary,
  primaryButtonText: colors.textWhite,
  secondaryButton: colors.buttonSecondary,
  secondaryButtonText: colors.textPrimary,

  // Borders
  inputBorder: colors.borderMedium,
  cardBorder: colors.border,
  divider: colors.border,

  // States
  active: colors.primary,
  inactive: colors.textTertiary,
  disabled: colors.buttonDisabled,
} as const;