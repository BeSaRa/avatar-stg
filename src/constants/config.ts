export const Config = {
  VERSION: 'v0.0.25',
  BASE_ENVIRONMENT: '',
  ENVIRONMENTS_URLS: {},
  BASE_URL: '',
  API_VERSION: 'v1',
  KUNA_DEV: '',
  KUNA_STG: '',
  KUNA_PROD: '',
  EXTERNAL_PROTOCOLS: ['http', 'https'],
  IDLE_AVATARS: [] as string[],
}

export type ConfigType = typeof Config
