// hooks/useAuth.ts
import { useEffect, useState, useCallback } from 'react';
import { createAuthService, TokenSet, UserData } from '../services/cognitoAuth';
import { env } from '../assets/config/env';

const cfg = {
  clientId: env.COGNITO_CLIENT_ID || '',
  domain: env.COGNITO_DOMAIN || '',
  redirectUri: env.COGNITO_REDIRECT_URI || undefined,
};

const auth = createAuthService(cfg);

export default function useAuth() {
  const [tokens, setTokens] = useState<TokenSet | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await auth.loadTokens();
      setTokens(t);
      setIsAuthenticated(!!t?.access_token);
      if (t?.id_token) {
        try {
          const b64 = t.id_token.split('.')[1];
          const decoded = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
          setUser(decoded);
        } catch {}
      }
    })();
  }, []);

  const signIn = useCallback(async () => {
    const t = await auth.signIn();
    setTokens(t);
    setIsAuthenticated(true);
    if (t.id_token) {
      try {
        const b64 = t.id_token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
        setUser(decoded);
      } catch {}
    }
  }, []);

  const signOut = useCallback(async () => {
    const url = await auth.signOut();
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
    // Optionally open logout URL
    // Linking.openURL(url);
  }, []);

  return { tokens, user, isAuthenticated, signIn, signOut };
}
