import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: colors.white,
    fontSize: 16,
    padding: 20,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: colors.overlayMedium,
    borderRadius: 20,
    padding: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  galleryButton: {
    alignItems: 'center',
    backgroundColor: colors.overlayMedium,
    borderRadius: 25,
    padding: 12,
    minWidth: 60,
  },
  flipButton: {
    alignItems: 'center',
    backgroundColor: colors.overlayMedium,
    borderRadius: 25,
    padding: 12,
    minWidth: 60,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.whiteOverlayVeryStrong,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});