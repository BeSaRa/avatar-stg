export const FEATURE_KEYS = {
  AUTH: 'auth',
  CHAT: 'chat',
  LEGAL_CHAT: 'legal_chat',
  ADMIN_PAGES: 'admin_pages',
  ADMIN_USERS: 'admin_users',
  ADMIN_STORAGE: 'admin_storage',
  ADMIN_LEGAL_STORAGE: 'admin_legal_storage',
  ADMIN_INDEXERS: 'admin_indexers',
  ADMIN_WEB_CRAWLER: 'admin_web_crawler',
  ADMIN_SOCIAL_MEDIA: 'admin_social_media',
  ADMIN_FAQ: 'admin_faq',
  AI_SEARCH: 'ai_search',
  AVATAR: 'avatar',
  VIDEO_GENERATOR: 'video_generator',
  CHAT_HISTORY: 'chat_history',
  REPORT_GENERATOR: 'report_generator',
  STATISTICS: 'statistics',
  ADMIN_INSIGHTS: 'admin_insights',
  CUSTOMER_SERVICE: 'customer_service',
  VIDEO_ANALYZER: 'video_analyzer',
} as const

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS]
