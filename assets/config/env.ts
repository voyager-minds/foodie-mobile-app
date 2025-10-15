import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export const env = {
  COGNITO_DOMAIN: extra.COGNITO_DOMAIN || process.env.COGNITO_DOMAIN,
  COGNITO_CLIENT_ID: extra.COGNITO_CLIENT_ID || process.env.COGNITO_CLIENT_ID,
  COGNITO_REDIRECT_URI: extra.COGNITO_REDIRECT_URI || process.env.COGNITO_REDIRECT_URI,
  APP_SCHEME: extra.APP_SCHEME || process.env.APP_SCHEME,
};

export default env;
