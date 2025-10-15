// services/cognitoAuth.ts
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export type TokenSet = {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

export type UserData = {
  sub?: string;
  email?: string;
  preferred_username?: string;
  [key: string]: any;
};

const TOKEN_KEY = 'cognito_tokens';
const PKCE_VERIFIER_KEY = 'pkce_verifier';

function base64UrlEncode(input: string | Uint8Array) {
  let str: string;
  if (typeof input === 'string') {
    str = input;
  } else {
    // Convert Uint8Array to binary string
    str = '';
    for (let i = 0; i < input.length; i++) {
      str += String.fromCharCode(input[i]);
    }
  }

  // Use btoa if available
  const b64 =
    typeof btoa === 'function'
      ? btoa(str)
      : Buffer
        ? Buffer.from(str, 'binary').toString('base64')
        : ''; // fallback if somehow in Node

  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export async function generateCodeVerifier() {
  // 32 bytes random
  const randomBytes = new Uint8Array(32);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(randomBytes);
  } else {
    // fallback
    for (let i = 0; i < randomBytes.length; i++) randomBytes[i] = Math.floor(Math.random() * 256);
  }

  return base64UrlEncode(randomBytes);
}

export async function generateCodeChallenge(verifier: string) {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );

  return digest.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// --- Storage helpers ---
export async function saveTokens(tokens: TokenSet) {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export async function loadTokens(): Promise<TokenSet | null> {
  const raw = await AsyncStorage.getItem(TOKEN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearTokens() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(PKCE_VERIFIER_KEY);
}

// --- Config ---
export type Config = {
  clientId: string;
  domain: string;
  scope?: string;
  redirectUri?: string;
};

// --- Auth service ---
export function createAuthService(cfg: Config) {
  const scope = cfg.scope || 'openid phone email';
  console.log('⚙️ Using cfg:', cfg);

  async function signIn(): Promise<TokenSet> {
    const verifier = await generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    await AsyncStorage.setItem(PKCE_VERIFIER_KEY, verifier);

    let redirectUri =
      cfg.redirectUri ||
      (Constants.executionEnvironment === 'storeClient'
        ? AuthSession.makeRedirectUri()
        : AuthSession.makeRedirectUri({
          scheme: 'foodieapp',
          path: 'callback', // optional but recommended
        }));
    redirectUri = "foodieapp://callback"

    console.log('🔁 Using redirect URI:', redirectUri);

    // Create AuthRequest
    const discovery = {
      authorizationEndpoint: `${cfg.domain}/oauth2/authorize`,
      tokenEndpoint: `${cfg.domain}/oauth2/token`,
      revocationEndpoint: `${cfg.domain}/logout`,
    };

    const request = new AuthSession.AuthRequest({
      clientId: cfg.clientId,
      redirectUri,
      scopes: scope.split(' '),
      responseType: AuthSession.ResponseType.Code,
      codeChallenge: challenge,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    });

    console.log('Request:', request);

    await request.makeAuthUrlAsync(discovery);

    const result = await request.promptAsync(discovery)

    console.log('🔴 Discovery result:', discovery);

    if (result.type !== 'success' || !result.params.code) {
      console.log('🔴 AuthSession result:', result);
      throw new Error('Authentication cancelled or failed');
    }

    const code = result.params.code;
    const storedVerifier = await AsyncStorage.getItem(PKCE_VERIFIER_KEY);
    console.log('🟢 AuthSession succeeded, code:', code);
    console.log('🟢 Stored verifier:', storedVerifier ? 'exists' : 'missing');

    // Exchange code for tokens
    const tokenUrl = `${cfg.domain}/oauth2/token`;
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', cfg.clientId);
    body.append('code', code);
    body.append('redirect_uri', redirectUri);
    body.append('scope', scope);
    if (storedVerifier) body.append('code_verifier', storedVerifier);

    console.log('🔁 Redirect URI:', redirectUri);
    console.log('🔁 Parsing URL:', tokenUrl);
    console.log('🔁 Parsing body:', body.toString());

    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('❌ Token exchange failed', resp.status, text);
      throw new Error('Token exchange failed: ' + text);
    }

    const tokens: TokenSet = await resp.json();
    await saveTokens(tokens);
    return null as any; // replace with tokens when fetch is enabled
  }

  async function signOut() {
    await clearTokens();
    const redirectUri =
      cfg.redirectUri ||
      (Constants.executionEnvironment === 'storeClient'
        ? AuthSession.makeRedirectUri()
        : AuthSession.makeRedirectUri({ scheme: Linking.createURL('').split('://')[0] }));

    const logoutUrl = `${cfg.domain}/logout?client_id=${encodeURIComponent(cfg.clientId)}&logout_uri=${encodeURIComponent(redirectUri)}`;
    return logoutUrl;
  }

  return { signIn, signOut, loadTokens, saveTokens, clearTokens };
}
