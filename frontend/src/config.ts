// Configuration for your backend URLs
const DEVELOPMENT = {
  API_BASE_URL: 'https://corrie-variolitic-impolitely.ngrok-free.dev/api',
  SOCKET_URL: 'https://corrie-variolitic-impolitely.ngrok-free.dev',
};

const PRODUCTION = {
  API_BASE_URL: 'https://your-production-url.com/api',
  SOCKET_URL: 'https://your-production-url.com',
};

const config = __DEV__ ? DEVELOPMENT : PRODUCTION;

export default config;