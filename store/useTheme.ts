import { useEffect, useState } from 'react';
import { MergedColors, ThemeStore } from './Theme.store';

// Define the shape of the hook return type
export interface UseThemeResult {
	colors: MergedColors;
	isDarkMode: boolean;
	toggleTheme: () => void;
}

export const useTheme = (): UseThemeResult => {
	const [colors, setColors] = useState<MergedColors>(ThemeStore.getColors());

	useEffect(() => {
		const unsubscribe = ThemeStore.subscribe((newColors) => {
			setColors(newColors);
		});

		return () => unsubscribe();
	}, []);

	return {
		colors,
		isDarkMode: ThemeStore.getIsDarkMode(),
		toggleTheme: ThemeStore.toggleTheme,
	};
};
