import { useEnvironmentStore } from './store/environment-store';

const BACKEND_PRODUCTION_API_HOST =
  'https://platform-main-appbuild-prod-d4a252a9.koyeb.app/';
const BACKEND_DEV_API_HOST =
  'https://platform-main-appbuild-dev-6fdad96f.koyeb.app/';
const BACKEND_LOCAL_API_HOST = 'http://127.0.0.1:4444';

// TODO: change to https://app.build once we deploy the web version in there
const AUTH_HOST_PRODUCTION = 'https://platform-web-neondatabase.vercel.app/';
const AUTH_HOST_DEV = 'http://localhost:5173';

export function getBackendHost() {
  const platformEnvironment = useEnvironmentStore
    .getState()
    .platformEnvironment();

  if (platformEnvironment === 'production') {
    return BACKEND_PRODUCTION_API_HOST;
  } else if (platformEnvironment === 'staging') {
    return BACKEND_DEV_API_HOST;
  } else {
    return BACKEND_LOCAL_API_HOST;
  }
}

export function getAuthHost() {
  if (process.env.NODE_ENV === 'production') {
    return AUTH_HOST_PRODUCTION;
  } else {
    return AUTH_HOST_DEV;
  }
}
