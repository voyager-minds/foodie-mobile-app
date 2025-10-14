import { Stack } from 'expo-router';

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name='Home' />
			<Stack.Screen name='Resturant' />
			<Stack.Screen name='Reviews' />
		</Stack>
	);
}
