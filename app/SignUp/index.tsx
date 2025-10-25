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
import { signUpStyles } from './styles';

export default function SignUpScreen() {
  const { colors } = useTheme();
  const styles = signUpStyles(colors);
  const { signInWithOAuth, signOut, isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  
  const handleSignUp = async () => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      Alert.alert(
        'Already Signed In',
        `You're already signed in as ${user.username}. Would you like to sign out and create a new account?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Out & Create New Account', 
            onPress: async () => {
              await signOut();
              // After signing out, proceed with fresh sign up
              setTimeout(async () => {
                const result = await signInWithOAuth(true); // Force fresh login
                if (result.success) {
                  router.replace('/Home');
                } else {
                  Alert.alert('Authentication Failed', result.error || 'Please try again.');
                }
              }, 500);
            }
          },
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
        result.error || 'Unable to complete registration. Please try again.',
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
                Join Foodie
              </Text>
              <Text style={styles.subtitle}>
                Create your account to start exploring
              </Text>
            </View>

            {/* OAuth Sign Up Card */}
            <View style={styles.card}>
              {/* Info Text */}
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Create your account securely with AWS Cognito. You&apos;ll be redirected to a secure registration page.
                </Text>
              </View>


              <TouchableOpacity
                onPress={handleSignUp}
                disabled={isLoading}
                style={[styles.signUpButton, isLoading && styles.disabledButton]}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="person-add-outline" size={20} color="white" />
                    <Text style={styles.signUpButtonText}>
                      Create Account
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Info about OAuth */}
              <View style={styles.securityInfo}>
                <View style={styles.securityHeader}>
                  <Ionicons name="shield-checkmark" size={16} color="#28a745" />
                  <Text style={styles.securityTitle}>
                    Secure Registration
                  </Text>
                </View>
                <Text style={styles.securityText}>
                  • Email verification included{'\n'}
                  • Secure password requirements{'\n'}
                  • Industry-standard security
                </Text>
              </View>

              {/* Sign In Link */}
              <View style={styles.signInLinkContainer}>
                <Text style={styles.signInLinkText}>
                  Already have an account? 
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/Login' as any)}
                  style={styles.signInLink}
                >
                  <Text style={styles.signInLinkTextBold}>
                    Sign In
                  </Text>
                </TouchableOpacity>
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