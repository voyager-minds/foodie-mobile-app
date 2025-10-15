export const lightColors = {
	// Primary Colors
	primary: '#ff7f50', // Coral/Salmon
	primaryLight: '#fff0e6', // Very light peach
	tagPrimary: '#ff7f50', // Coral/Salmon for tags and highlights

	// Background Colors
	background: '#fffaf2', // Off-white/Creamy background
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

// Color aliases for semantic usage (Light Theme)
export const semanticColors = {
	// Backgrounds
	screenBackground: lightColors.background,
	cardBackground: lightColors.white,
	modalBackground: lightColors.white,
	inputBackground: lightColors.gray100,

	// Text
	primaryText: lightColors.textPrimary,
	secondaryText: lightColors.textSecondary,
	placeholderText: lightColors.textTertiary,
	whiteText: lightColors.textWhite,

	// Buttons
	primaryButton: lightColors.primary,
	primaryButtonText: lightColors.textWhite,
	secondaryButton: lightColors.buttonSecondary,
	secondaryButtonText: lightColors.textPrimary,

	// Borders
	inputBorder: lightColors.borderMedium,
	cardBorder: lightColors.border,
	divider: lightColors.border,

	// States
	active: lightColors.primary,
	inactive: lightColors.textTertiary,
	disabled: lightColors.buttonDisabled,
} as const;

export const darkColors = {
	// Primary Colors (Maintain similar hue for consistency)
	primary: '#ff7f50', // Coral/Salmon
	primaryLight: '#cc6640', // Darker primary for hover/active states
	tagPrimary: '#fff', // Same coral/salmon for tags and highlights

	// Background Colors (Inverted: Darker shades)
	background: '#121212', // Very dark gray for main background
	white: '#1e1e1e', // Dark equivalent of 'white' for elevated elements (cards, modals)
	black: '#fff', // White for the darkest color's opposite (text)

	// Text Colors (Inverted: Lighter shades)
	textPrimary: '#ffffff', // Pure white for main text
	textSecondary: '#bdbdbd', // Light gray for secondary/less important text
	textTertiary: '#a0a0a0', // Slightly darker light gray for hints/placeholders
	textLight: '#909090',
	textDark: '#e0e0e0',
	textWhite: '#121212', // Very dark for text on a white-like element in dark mode

	// Border Colors (Subtle light grays)
	border: '#2c2c2c', // Subtle dark border
	borderLight: '#3a3a3a',
	borderMedium: '#424242',
	borderDark: '#222222',

	// Gray Scale (Darker Grays)
	gray50: '#1a1a1a',
	gray100: '#222222',
	gray200: '#2c2c2c',
	gray300: '#3a3a3a',
	gray400: '#4f4f4f',

	// Status Colors (Brighter/more saturated for visibility against dark backgrounds)
	success: '#69f0ae', // Light green
	warning: '#ffeb3b', // Bright yellow
	error: '#ff5252', // Bright red
	info: '#4fc3f7', // Light blue

	// Transparent Colors (Black overlay is fine)
	overlay: 'rgba(0,0,0,0.6)',
	overlayLight: 'rgba(0,0,0,0.4)',
	overlayDark: 'rgba(0,0,0,0.8)',
	overlayMedium: 'rgba(0,0,0,0.7)',

	// White Transparent (Now subtle white overlay for elevation/shine)
	whiteOverlay: 'rgba(255, 255, 255, 0.1)',
	whiteOverlayLight: 'rgba(255, 255, 255, 0.03)',
	whiteOverlayMedium: 'rgba(255, 255, 255, 0.05)',
	whiteOverlayStrong: 'rgba(255, 255, 255, 0.15)',
	whiteOverlayVeryStrong: 'rgba(255, 255, 255, 0.3)',
	whiteOverlayAlmostOpaque: 'rgba(255, 255, 255, 0.9)',
	whiteOverlayOpaque: 'rgba(255, 255, 255, 0.95)',

	// Shadow Colors (Subtle in dark mode)
	shadow: 'rgba(0, 0, 0, 0.8)',
	shadowText: 'rgba(255, 255, 255, 0.15)',

	// Special Colors
	avatar: '#403328', // Darker background for avatar
	rating: '#ffb74d',

	// Button States
	buttonDisabled: '#2c2c2c',
	buttonSecondary: '#333333',
} as const;

// Color aliases for semantic usage (Dark Theme)
export const darkSemanticColors = {
	// Backgrounds
	screenBackground: darkColors.background,
	cardBackground: darkColors.white,
	modalBackground: darkColors.white,
	inputBackground: darkColors.gray100,

	// Text
	primaryText: darkColors.textPrimary,
	secondaryText: darkColors.textSecondary,
	placeholderText: darkColors.textTertiary,
	whiteText: darkColors.textWhite,

	// Buttons
	primaryButton: darkColors.primary,
	primaryButtonText: darkColors.textPrimary,
	secondaryButton: darkColors.buttonSecondary,
	secondaryButtonText: darkColors.textPrimary,

	// Borders
	inputBorder: darkColors.borderMedium,
	cardBorder: darkColors.border,
	divider: darkColors.border,

	// States
	active: darkColors.primary,
	inactive: darkColors.textTertiary,
	disabled: darkColors.buttonDisabled,
} as const;
