export const AWS_CONFIG = {
  // Your Cognito Domain (without https://)
  COGNITO_DOMAIN: 'us-east-12ygyiqstd.auth.us-east-1.amazoncognito.com',

  // Your AWS Cognito User Pool Client ID  
  USER_POOL_CLIENT_ID: '4buaaosur2hrb67a8jb9nk96qj',

  // Your redirect URI (where users return after authentication)
  REDIRECT_URI: 'foodieapp://callback',

  // Your app scheme for deep linking
  APP_SCHEME: 'foodieapp',

  // OAuth scopes (what user info you want to access)
  // Try with minimal scopes first - these are usually enabled by default
  SCOPES: ['openid'],

  // Response type for OAuth flow
  RESPONSE_TYPE: 'code' as const,
};
