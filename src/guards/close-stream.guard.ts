import { CanDeactivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { AppStore } from '@/stores/app.store'
import { AvatarService } from '@/services/avatar.service'
import { EmployeeService } from '@/services/employee.service'

export const closeStreamGuard: CanDeactivateFn<unknown> = () => {
  const store = inject(AppStore)
  const employeeService = inject(EmployeeService)
  const avatarService = inject(AvatarService)
  if (store.streamId() && employeeService.hasAuthenticatedUser()) {
    avatarService.closeStream().subscribe()
  }
  return employeeService.hasAuthenticatedUser() ? confirm('Stream will be closed') : true
}
