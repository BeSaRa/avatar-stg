import { MenuItem } from '@/contracts/menu-item-contract'

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    label: 'home',
    route: '/home',
    svg: 'HOME',
    permissions: ['ADMIN'],
  },
  {
    id: 2,
    label: 'admin_services',
    route: '/home/admin',
    svg: 'SUIT_CASE',
    permissions: ['ADMIN'],
  },
  {
    id: 3,
    label: 'search',
    route: '/home/search',
    svg: 'SEARCH',
    permissions: ['SEARCH'],
  },
  {
    id: 4,
    label: 'avatar_chat',
    route: '/home/avatar',
    svg: 'AVATAR',
    permissions: ['AVATAR'],
  },
  {
    id: 6,
    label: 'chat_history',
    route: '/home/chat-history',
    svg: 'HISTORY',
    permissions: ['CHATBOT'],
  },
  {
    id: 7,
    label: 'report_generator',
    route: '/home/web-crawler',
    svg: 'WEB_CRAWLER',
    permissions: ['SEARCH'],
  },
  {
    id: 8,
    label: 'statistics',
    route: '/home/statistics',
    svg: 'POLL',
    permissions: ['ADMIN'],
  },
  {
    id: 10,
    label: 'doc_analyzer',
    route: '/home/doc-intelligence',
    svg: 'DOCUMENT',
    permissions: ['DOCUMENT_INTELLIGENCE'],
  },
  {
    id: 13,
    label: 'video_indexer',
    route: '/home/video-indexer',
    svg: 'VIDEO',
    permissions: ['MEDIA'],
  },
  {
    id: 14,
    label: 'video_generator',
    route: '/video-generator',
    svg: 'VIDEO_GENERATOR',
    permissions: ['AVATAR'],
  },
]
