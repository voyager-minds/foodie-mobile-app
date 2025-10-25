// AWS Cognito OAuth Configuration Example
// Copy this file to aws-config.ts and replace with your actual values

export const AWS_CONFIG = {
  // Your Cognito Domain (without https://)
  // Example: 'your-app.auth.us-east-1.amazoncognito.com'
  // This is the domain you configured in Cognito for hosted UI
  COGNITO_DOMAIN: 'your-app.auth.us-east-1.amazoncognito.com',
  
  // Your AWS Cognito User Pool Client ID  
  // Get this from AWS Console > Cognito > User Pools > Your Pool > App Integration > App clients
  // Format: '1234567890abcdefghijklmnop'
  USER_POOL_CLIENT_ID: '1234567890abcdefghijklmnop',
  
  // Your redirect URI (where users return after authentication)
  // This should match what you configured in Cognito
  // For Expo development: 'exp://localhost:8081'
  // For production: 'foodieapp://auth' (using your app scheme)
  REDIRECT_URI: 'foodieapp://auth',
  
  // Your app scheme for deep linking
  // This should match the "scheme" in your app.json
  // Example: 'foodieapp' (from app.json: "scheme": "foodieapp")
  APP_SCHEME: 'foodieapp',
  
  // OAuth scopes (what user info you want to access)
  // Standard scopes for getting user email and profile info
  SCOPES: ['email', 'profile', 'openid'],
  
  // Response type for OAuth flow
  // Use 'code' for authorization code flow (recommended)
  RESPONSE_TYPE: 'code' as const,
};