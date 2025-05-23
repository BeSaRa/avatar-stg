import { MenuItem } from '@/contracts/menu-item-contract'
import { PERMISSION_GROUPS } from './all-permissions'
import { ADMIN_MENU_ITEMS } from './admin-menu-items'

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    label: 'home',
    route: '/home',
    svg: 'HOME',
    permissions: [],
  },
  {
    id: 2,
    label: 'admin_services',
    route: '/home/admin',
    svg: 'SUIT_CASE',
    permissions: PERMISSION_GROUPS['ADMIN_GROUP'],
    haveSomeOfPermissions: true,
    children: ADMIN_MENU_ITEMS,
  },
  {
    id: 3,
    label: 'search',
    route: '/home/search',
    svg: 'SEARCH',
    permissions: PERMISSION_GROUPS['SEARCH_GROUP'],
    haveSomeOfPermissions: true,
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
    permissions: PERMISSION_GROUPS['CHAT_HISTORY_GROUP'],
  },
  {
    id: 7,
    label: 'report_generator',
    route: '/home/web-crawler',
    svg: 'WEB_CRAWLER',
    permissions: PERMISSION_GROUPS['REPORT_GENERATOR_GROUP'],
  },
  {
    id: 8,
    label: 'statistics',
    route: '/home/statistics',
    svg: 'POLL',
    permissions: PERMISSION_GROUPS['STATISTICS_GROUP'],
    haveSomeOfPermissions: true,
  },
  {
    id: 14,
    label: 'video_generator',
    route: '/home/video-generator',
    svg: 'VIDEO_GENERATOR',
    permissions: PERMISSION_GROUPS['VIDEO_GENERATOR_GROUP'],
  },
]
