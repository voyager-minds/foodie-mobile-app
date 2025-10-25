import { AuthProvider, useAuth } from '@/store/AuthContext';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

function AuthHandler() {
	const { handleOAuthRedirect } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const handleDeepLink = async (url: string) => {
			// Check if this is an OAuth redirect
			if (url.includes('code=') || url.includes('access_token=') || url.includes('error=')) {
				const result = await handleOAuthRedirect(url);

				if (result.success) {
					// Redirect to Home screen on successful authentication
					router.replace('/Home');
				} else {
					// Show error message and redirect to login
					Alert.alert(
						'Authentication Failed',
						result.error || 'Unable to complete authentication. Please try again.',
						[{ text: 'OK', onPress: () => router.replace('/') }]
					);
				}
			}
		};

		// Handle initial URL if app was opened via deep link
		Linking.getInitialURL().then((url) => {
			if (url) {
				handleDeepLink(url);
			}
		});

		// Listen for incoming deep links while app is running
		const subscription = Linking.addEventListener('url', ({ url }) => {
			handleDeepLink(url);
		});

		return () => subscription?.remove();
	}, [handleOAuthRedirect, router]);

	return null;
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<AuthHandler />
			<Stack
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name='index' />
				<Stack.Screen name='Login' />
				<Stack.Screen name='SignUp' />

				<Stack.Screen name='Home' />
				<Stack.Screen name='Resturant' />
				<Stack.Screen name='Reviews' />
			</Stack>
		</AuthProvider>
	);
}
