import { CanActivateFn, Router } from '@angular/router'
import { EmployeeService } from '@/services/employee.service'
import { inject } from '@angular/core'

export const visitorGuard: CanActivateFn = () => {
  const employeeService = inject(EmployeeService)
  const router = inject(Router)
  return employeeService.hasAuthenticatedUser() ? router.parseUrl('/home') : true
}
