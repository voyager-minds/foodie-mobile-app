import { AWS_CONFIG } from '@/config/aws-config';
import { fetchAuthSession } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import http from "./http";

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Extract region from domain
const extractRegionFromDomain = (domain: string): string => {
    const match = domain.match(/\.auth\.([^.]+)\.amazoncognito\.com/);
    return match ? match[1] : 'us-east-1';
};

export const createAuthLog = async (user: any) => {
    try {
        const response = await http.post(`/auth/logs`, user);
        return response;
    } catch (error: any) {
        console.error('Failed to create auth log:', error);
    }
}

const region = extractRegionFromDomain(AWS_CONFIG.COGNITO_DOMAIN);

// Simple Amplify configuration for OAuth
const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: `${region}_dummy123`, // More realistic dummy value
            userPoolClientId: AWS_CONFIG.USER_POOL_CLIENT_ID,
            region: region,
            loginWith: {
                oauth: {
                    domain: AWS_CONFIG.COGNITO_DOMAIN,
                    scopes: AWS_CONFIG.SCOPES,
                    redirectSignIn: [AWS_CONFIG.REDIRECT_URI],
                    redirectSignOut: [AWS_CONFIG.REDIRECT_URI],
                    responseType: AWS_CONFIG.RESPONSE_TYPE
                }
            }
        }
    }
};

// Configure Amplify
Amplify.configure(awsConfig);

export interface AuthUser {
    username: string;
    email?: string;
    attributes?: Record<string, any>;
}

// Simple in-memory token storage (in production, use secure storage)
let currentTokens: any = null;
let currentUser: AuthUser | null = null;

class SimpleAuthService {
    // Sign in with OAuth/Hosted UI
    async signInWithOAuth(forceLogin: boolean = false) {
        try {
            const oauthUrl = this.buildOAuthUrl(forceLogin);

            // Open the OAuth URL in browser
            const result = await WebBrowser.openAuthSessionAsync(
                oauthUrl,
                AWS_CONFIG.REDIRECT_URI
            );

            if (result.type === 'success' && result.url) {
                if (result.url.includes('error=')) {
                    // Parse the error from the URL
                    const urlParams = new URLSearchParams(result.url.split('?')[1]);
                    const error = urlParams.get('error');
                    const errorDescription = urlParams.get('error_description');

                    return {
                        success: false,
                        error: errorDescription || error || 'Authentication failed'
                    };
                } else if (result.url.includes('code=')) {
                    const authResult = await this.handleOAuthRedirect(result.url);
                    return authResult;
                } else {
                    return {
                        success: false,
                        error: 'Authentication failed - no authorization code received'
                    };
                }
            } else if (result.type === 'cancel') {
                return {
                    success: false,
                    error: 'Authentication cancelled by user'
                };
            } else {
                return {
                    success: false,
                    error: 'Authentication failed - unable to open login page'
                };
            }
        } catch (error: any) {
            console.error('OAuth sign in error:', error);
            return {
                success: false,
                error: error.message || 'Sign in failed'
            };
        }
    }

    // Build OAuth URL for sign in
    private buildOAuthUrl(forceLogin: boolean = false): string {
        const params = new URLSearchParams({
            client_id: AWS_CONFIG.USER_POOL_CLIENT_ID,
            response_type: AWS_CONFIG.RESPONSE_TYPE,
            scope: AWS_CONFIG.SCOPES.join(' '),
            redirect_uri: AWS_CONFIG.REDIRECT_URI,
        });

        // Add prompt=login to force fresh authentication
        if (forceLogin) {
            params.append('prompt', 'login');
        }

        const url = `https://${AWS_CONFIG.COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;


        return url;
    }

    // Handle OAuth redirect from deep link
    async handleOAuthRedirect(url: string) {
        try {
            const parsedUrl = Linking.parse(url);
            const queryParams = parsedUrl.queryParams;

            // Check for authorization code or error
            if (queryParams?.code) {
                const tokenResult = await this.exchangeCodeForTokens(queryParams.code as string);

                if (tokenResult.success && tokenResult.tokens) {

                    // Store tokens and create user object
                    currentTokens = tokenResult.tokens;
                    const user = await this.createUserFromTokens(tokenResult.tokens);
                    currentUser = user;

                    return {
                        success: true,
                        user
                    };
                } else {
                    return {
                        success: false,
                        error: tokenResult.error || 'Authentication failed - unable to exchange authorization code'
                    };
                }
            } else if (queryParams?.error) {
                console.error('❌ OAuth error received:', queryParams.error);
                const errorMsg = queryParams.error_description as string || queryParams.error as string;
                return {
                    success: false,
                    error: `Authentication failed: ${errorMsg}`
                };
            } else {
                return {
                    success: false,
                    error: 'Authentication failed - invalid response from login service'
                };
            }
        } catch (error: any) {
            console.error('OAuth redirect handling error:', error);
            return {
                success: false,
                error: error.message || 'Authentication failed'
            };
        }
    }

    // Exchange authorization code for tokens manually
    private async exchangeCodeForTokens(code: string) {
        try {

            const tokenUrl = `https://${AWS_CONFIG.COGNITO_DOMAIN}/oauth2/token`;

            const body = new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: AWS_CONFIG.USER_POOL_CLIENT_ID,
                code: code,
                redirect_uri: AWS_CONFIG.REDIRECT_URI,
            });



            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            const tokenData = await response.json();


            if (response.ok && tokenData.access_token) {
                return {
                    success: true,
                    tokens: tokenData
                };
            } else {
                console.error('❌ Token exchange failed:', tokenData);
                return {
                    success: false,
                    error: tokenData.error_description || tokenData.error || 'Token exchange failed'
                };
            }
        } catch (error: any) {
            console.error('❌ Token exchange error:', error);
            return {
                success: false,
                error: error.message || 'Network error during token exchange'
            };
        }
    }

    // Create user object from tokens
    private async createUserFromTokens(tokens: any): Promise<AuthUser> {
        try {
            // Decode the ID token to get user info
            if (tokens.id_token) {
                // Simple JWT decode (just the payload, no verification since we trust Cognito)
                const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));


                return {
                    username: payload.sub || payload['cognito:username'] || 'user',
                    email: payload.email,
                    attributes: payload
                };
            } else {
                // Fallback if no ID token
                return {
                    username: 'user',
                    email: undefined,
                    attributes: {}
                };
            }
        } catch (error) {
            console.error('Error creating user from tokens:', error);
            return {
                username: 'user',
                email: undefined,
                attributes: {}
            };
        }
    }

    // Sign out user
    async signOut() {
        try {
            currentTokens = null;
            currentUser = null;
            return { success: true };
        } catch (error: any) {
            console.error('Sign out error:', error);
            return {
                success: false,
                error: error.message || 'Sign out failed'
            };
        }
    }

    // Get current authenticated user
    async getCurrentUser(): Promise<AuthUser | null> {
        return currentUser;
    }

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        return currentTokens !== null && currentUser !== null;
    }

    // Get auth session
    async getAuthSession() {
        try {
            const session = await fetchAuthSession();
            return {
                success: true,
                session
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to get session'
            };
        }
    }
}

export const authService = new SimpleAuthService();