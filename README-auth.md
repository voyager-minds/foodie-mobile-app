Expo + Cognito Authorization Code Flow (PKCE)

1) Install required packages in your Expo app:

```sh
npx expo install expo-auth-session expo-random expo-crypto @react-native-async-storage/async-storage
```

2) Configuration (set these in your environment or app config):

- COGNITO_DOMAIN (e.g. https://your-domain.auth.us-west-2.amazoncognito.com)
- COGNITO_CLIENT_ID
- COGNITO_REDIRECT_URI (e.g. myapp://redirect) - must be configured as an auth redirect in Cognito and in your app.json/scheme

3) Usage in components:

```tsx
import useAuth from './src/hooks/useAuth';

function LoginScreen() {
  const { signIn } = useAuth();
  return <Button title="Sign in" onPress={() => signIn()} />;
}
```

Notes:
- This implementation uses Expo's AuthSession.startAsync which opens the system browser for the Hosted UI.
- The token exchange is done directly against Cognito /oauth2/token endpoint using the stored PKCE verifier.
- Store tokens securely (AsyncStorage is simple but consider SecureStore for production).
