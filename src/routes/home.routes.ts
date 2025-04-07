import { PermissionRouteData } from '@/contracts/permission-rout-data'
import { PermissionGuard } from '@/guards/permission.guard'
import { LandingComponent } from '@/views/landing/landing.component'
import { Routes } from '@angular/router'

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'search',
    loadComponent: () => import('@/views/ai-search/ai-search.component').then(c => c.AiSearchComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['SEARCH'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'chat-history',
    loadComponent: () => import('@/views/chat-history/chat-history.component').then(c => c.ChatHistoryComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['CHATBOT'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'tasks-agent',
    loadComponent: () => import('@/views/agent-chat/agent-chat.component').then(c => c.AgentChatComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['CHATBOT'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'web-crawler',
    loadComponent: () =>
      import('@/views/web-crawler-report/web-crawler-report.component').then(c => c.WebCrawlerReportComponent),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['SEARCH'], hasAnyPermission: false } as PermissionRouteData,
  },
  {
    path: 'statistics',
    loadComponent: () => import('@/views/statistics/statistics.component').then(c => c.StatisticsComponent),
  },
  {
    path: 'admin',
    loadChildren: () => import('@/routes/admin.routes'),
    canActivate: [PermissionGuard.canActivate],
    data: { permissions: ['ADMIN'], hasAnyPermission: true } as PermissionRouteData,
  },
  {
    path: '**',
    redirectTo: '',
  },
]

export default routes
