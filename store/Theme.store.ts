import {
	darkColors,
	darkSemanticColors,
	lightColors,
	semanticColors,
} from '../constants/colors';

// --- TYPES ---
type ThemeName = 'light' | 'dark';
export type MergedColors = typeof lightColors & typeof semanticColors;

// --- MODULE STATE ---
let currentThemeName: ThemeName = 'light';
let subscribers: ((colors: MergedColors) => void)[] = [];

// --- HELPER FUNCTION (Isolated from the exported object to avoid 'this' issues) ---
const getMergedColors = (name: ThemeName): MergedColors => {
	const isDark = name === 'dark';
	const themeConstants = isDark ? darkColors : lightColors;
	const themeSemantics = isDark ? darkSemanticColors : semanticColors;

	return { ...themeConstants, ...themeSemantics } as MergedColors;
};

export const ThemeStore = {
	getColors(): MergedColors {
		return getMergedColors(currentThemeName);
	},

	getIsDarkMode(): boolean {
		return currentThemeName === 'dark';
	},

	toggleTheme() {
		currentThemeName = currentThemeName === 'light' ? 'dark' : 'light';

		const newColors = getMergedColors(currentThemeName);

		// Notify all subscribed components
		subscribers.forEach((callback) => callback(newColors));
	},

	subscribe(callback: (colors: MergedColors) => void) {
		subscribers.push(callback);

		// Return an unsubscribe function
		return () => {
			subscribers = subscribers.filter((sub) => sub !== callback);
		};
	},
};
