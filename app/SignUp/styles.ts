import { ColorsType } from '@/constants/colours';
import { StyleSheet } from 'react-native';

export const signUpStyles = (colors: ColorsType) =>
	StyleSheet.create({
		container: {
			flex: 1,
		},
		gradient: {
			flex: 1,
		},
		scrollContainer: {
			flexGrow: 1,
		},
		content: {
			flex: 1,
			justifyContent: 'center',
			paddingHorizontal: 30,
			paddingVertical: 50,
		},
		header: {
			alignItems: 'center',
			marginBottom: 40,
		},
		logoContainer: {
			width: 80,
			height: 80,
			borderRadius: 40,
			backgroundColor: 'white',
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: 20,
		},
		title: {
			fontSize: 28,
			fontWeight: 'bold',
			color: 'white',
			marginBottom: 8,
		},
		subtitle: {
			fontSize: 16,
			color: 'rgba(255,255,255,0.8)',
			textAlign: 'center',
		},
		card: {
			backgroundColor: 'white',
			borderRadius: 20,
			padding: 30,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 10 },
			shadowOpacity: 0.1,
			shadowRadius: 20,
			elevation: 10,
		},
		infoContainer: {
			marginBottom: 30,
		},
		infoText: {
			fontSize: 16,
			color: '#666',
			textAlign: 'center',
			lineHeight: 22,
		},
		signUpButton: {
			backgroundColor: '#ff7f50',
			borderRadius: 12,
			paddingVertical: 16,
			alignItems: 'center',
			marginBottom: 20,
		},
		disabledButton: {
			opacity: 0.7,
		},
		buttonContent: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		signUpButtonText: {
			color: 'white',
			fontSize: 18,
			fontWeight: '600',
			marginLeft: 8,
		},
		securityInfo: {
			backgroundColor: '#f8f9fa',
			borderRadius: 8,
			padding: 15,
			marginBottom: 20,
		},
		securityHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: 8,
		},
		securityTitle: {
			color: '#28a745',
			fontSize: 14,
			fontWeight: '600',
			marginLeft: 6,
		},
		securityText: {
			fontSize: 12,
			color: '#666',
			lineHeight: 16,
		},
		signInLinkContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
		signInLinkText: {
			color: '#666',
			fontSize: 16,
		},
		signInLink: {
			marginLeft: 5,
		},
		signInLinkTextBold: {
			color: '#ff7f50',
			fontSize: 16,
			fontWeight: '600',
		},
		backButton: {
			alignSelf: 'center',
			marginTop: 30,
			flexDirection: 'row',
			alignItems: 'center',
		},
		backButtonText: {
			color: 'white',
			fontSize: 16,
			marginLeft: 8,
		},
	});