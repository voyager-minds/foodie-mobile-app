import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
      COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
      COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI,
      APP_SCHEME: process.env.APP_SCHEME,
    },
    scheme: process.env.APP_SCHEME || config.scheme,
  };
};
