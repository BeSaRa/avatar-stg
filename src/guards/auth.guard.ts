import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { EmployeeService } from '@/services/employee.service'
import { skipGuardIfAuthDisabled } from '@/utils/utils'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  employeeService = inject(EmployeeService)
  router = inject(Router)
  injector = inject(Injector)

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return runInInjectionContext(this.injector, () => {
      return skipGuardIfAuthDisabled(() => {
        return this.employeeService.hasAuthenticatedUser() ? true : this.router.navigate(['auth/login'])
      })
    })
  }
}
