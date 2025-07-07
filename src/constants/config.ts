export const Config = {
  VERSION: 'v0.1.7',
  BASE_ENVIRONMENT: '',
  ENVIRONMENTS_URLS: {},
  BASE_URL: '',
  API_VERSION: 'v1',
  KUNA_KEYS: {} as Record<string, string>,
  OCP_APIM_KEYS: {} as Record<string, string>,
  IS_OCP: false,
  ENTITY_NAME: '',
  EXTERNAL_PROTOCOLS: ['http', 'https'],
  IDLE_AVATARS: [] as string[],
  ACCESS_TOKEN_COOKIE_NAME: '$__AT__$',
  REFRESH_TOKEN_COOKIE_NAME: '$__RT__$',
  ACCESS_TOKEN_TTL_IN_MINUTES: 30,
  REFRESH_ACCESS_TOKEN_BEFORE_ENDING_IN_MINUTES: 5,
}

export type ConfigType = typeof Config
