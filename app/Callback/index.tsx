import { useAuthRequestResult } from 'expo-auth-session';
import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { createAuthService } from '@/services/cognitoAuth';
import React from 'react';

export default function Callback() {
  // Here you could process the auth response if needed
  useEffect(() => {
    // Redirect to home or wherever
    router.replace('/Home');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Signing you in...</Text>
    </View>
  );
}
