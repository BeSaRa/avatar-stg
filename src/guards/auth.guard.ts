import { inject, Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { EmployeeService } from '@/services/employee.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  employeeService = inject(EmployeeService)
  router = inject(Router)

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.employeeService.hasAuthenticatedUser() ? true : this.router.navigate(['auth/login'])
  }
}
