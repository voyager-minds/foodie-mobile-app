import { useAuth } from '@/store/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../store/useTheme';
import { loginStyles } from './styles';

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = loginStyles(colors);
  const { signInWithOAuth, isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      Alert.alert(
        'Already Signed In',
        `You're already signed in as ${user.username}. Would you like to go to the home screen?`,
        [
          { text: 'Stay Here', style: 'cancel' },
          {
            text: 'Go to Home',
            onPress: () => router.replace('/Home')
          }
        ]
      );
      return;
    }
    
    const result = await signInWithOAuth();
    
    if (result.success) {
      router.replace('/Home');
    } else {
      Alert.alert(
        'Authentication Failed', 
        result.error || 'Unable to authenticate. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#ff7f50', '#ff6b35', '#ff5722']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="restaurant" size={40} color="#ff7f50" />
              </View>
              <Text style={styles.title}>
                Welcome Back
              </Text>
              <Text style={styles.subtitle}>
                Sign in to continue your foodie journey
              </Text>
            </View>

            {/* OAuth Login Card */}
            <View style={styles.card}>
              {/* Info Text */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Sign in securely with AWS Cognito. You&apos;ll be redirected to a secure login page.
                </Text>
              </View>


              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={[styles.loginButton, isLoading && styles.disabledButton]}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="log-in-outline" size={20} color="white" />
                    <Text style={styles.loginButtonText}>
                      Sign In with Cognito
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Info about OAuth */}
              <View style={styles.securityInfo}>
                <View style={styles.securityHeader}>
                  <Ionicons name="shield-checkmark" size={16} color="#28a745" />
                  <Text style={styles.securityTitle}>
                    Secure Authentication
                  </Text>
                </View>
                <Text style={styles.securityText}>
                  • Sign in or create account{'\n'}
                  • Secure OAuth flow{'\n'}
                  • No passwords stored locally
                </Text>
              </View>
            </View>


            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
              <Text style={styles.backButtonText}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}