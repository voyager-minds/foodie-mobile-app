Expo env setup

1. Copy `.env.example` to `.env` and fill values.

2. Install dotenv for app.config.js (dev only):

```sh
npm install --save-dev dotenv
```

3. Run Expo with the env loaded (your shell will load .env automatically if you use a dotenv-aware runner). Example:

```sh
# macOS / Linux
cp .env.example .env
# edit .env
expo start
```

4. Access values in app:

```ts
import env from './src/config/env';
console.log(env.COGNITO_DOMAIN);
```

Notes:
- In production builds the values from app.config.js will be embedded in the binary.
- For EAS or CI, set environment variables in the build environment or use secrets.
