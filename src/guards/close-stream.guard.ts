import { CanDeactivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { AppStore } from '@/stores/app.store'
import { AvatarService } from '@/services/avatar.service'
import { EmployeeService } from '@/services/employee.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const closeStreamGuard: CanDeactivateFn<unknown> = (cmp: any) => {
  const store = inject(AppStore)
  const employeeService = inject(EmployeeService)
  const avatarService: AvatarService | undefined =
    typeof cmp.getAvatarService === 'function' ? cmp.getAvatarService() : undefined
  if (store.streamIdMap()[avatarService!.componentName()] && employeeService.hasAuthenticatedUser()) {
    avatarService!.closeStream().subscribe()
  }
  return employeeService.hasAuthenticatedUser() ? confirm('Stream will be closed') : true
}
