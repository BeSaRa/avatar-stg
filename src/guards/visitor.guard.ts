import { CanActivateFn, Router } from '@angular/router'
import { EmployeeService } from '@/services/employee.service'
import { inject } from '@angular/core'
import { skipGuardIfAuthDisabled } from '@/utils/utils'

export const visitorGuard: CanActivateFn = () => {
  return skipGuardIfAuthDisabled(() => {
    const employeeService = inject(EmployeeService)
    const router = inject(Router)
    return employeeService.hasAuthenticatedUser() ? router.parseUrl('/home') : true
  })
}
