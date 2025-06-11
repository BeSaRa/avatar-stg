export {}

declare global {
  interface Window {
    IdleDetector: typeof IdleDetector
  }

  interface Permissions {
    query(permissionDesc: { name: PermissionName }): Promise<PermissionStatus>
    query(permissionDesc: { name: PermissionName | 'idle-detection' }): Promise<PermissionStatus>
  }
}

interface IdleDetector {
  addEventListener(
    type: 'change',
    listener: (this: IdleDetector, ev: Event) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void
  start(options: { threshold: number }): Promise<void>
  screenState: 'locked' | 'unlocked'
  userState: 'active' | 'idle'
}

declare const IdleDetector: {
  new (): IdleDetector
  requestPermission(): Promise<'granted' | 'denied'>
}
