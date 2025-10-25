import { useTheme } from '@/store/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Text, TouchableOpacity, View } from 'react-native';
import { cameraStyles } from './styles';

interface CameraProps {
	onImageCaptured: (imageUri: string) => void;
	onClose: () => void;
}

export default function Camera({ onImageCaptured, onClose }: CameraProps) {
	const { colors, isDarkMode, toggleTheme } = useTheme();
	const styles = cameraStyles(colors);
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const [isCameraReady, setIsCameraReady] = useState(false);
	const cameraRef = useRef<CameraView>(null);

	useEffect(() => {
		return () => {};
	}, []);

	if (!permission) {
		// Camera permissions are still loading.
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Loading camera permissions...</Text>
			</View>
		);
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button
					onPress={requestPermission}
					title='Grant Permission'
				/>
			</View>
		);
	}

	const toggleCameraFacing = () => {
		setFacing((current) => (current === 'back' ? 'front' : 'back'));
	};

	const takePicture = async () => {
		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync({
					quality: 0.8,
					base64: false,
				});
				if (photo?.uri) {
					onImageCaptured(photo.uri);
				}
			} catch (error) {
				console.error('Error taking picture:', error);
				Alert.alert('Error', 'Failed to take picture');
			}
		}
	};

	const pickImageFromGallery = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				onImageCaptured(result.assets[0].uri);
			}
		} catch (error) {
			console.error('Error picking image:', error);
			Alert.alert('Error', 'Failed to pick image');
		}
	};

	return (
		<View style={styles.container}>

			<TouchableOpacity
				style={styles.closeButton}
				onPress={onClose}>
				<Ionicons
					name='close'
					size={24}
					color='white'
				/>
			</TouchableOpacity>


			<CameraView
				style={styles.camera}
				facing={facing}
				ref={cameraRef}
				onCameraReady={() => {
					setIsCameraReady(true);
				}}
				onMountError={(error) => {
					console.error('Camera mount error:', error);
					Alert.alert(
						'Camera Error',
						'Failed to initialize camera: ' + error.message
					);
				}}
			/>


			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.galleryButton}
					onPress={pickImageFromGallery}>
					<Ionicons
						name='images'
						size={24}
						color='white'
					/>
					<Text style={styles.buttonText}>Gallery</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.captureButton}
					onPress={takePicture}>
					<View style={styles.captureButtonInner} />
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.flipButton}
					onPress={toggleCameraFacing}>
					<Ionicons
						name='camera-reverse'
						size={24}
						color='white'
					/>
					<Text style={styles.buttonText}>Flip</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
