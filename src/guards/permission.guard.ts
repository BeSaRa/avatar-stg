import { MessageService } from '@/services/message.service'
import { PermissionRouteData } from '@/contracts/permission-rout-data'
import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router'
import { LocalService } from '@/services/local.service'
import { EmployeeService } from '@/services/employee.service'
import { skipGuardIfAuthDisabled } from '@/utils/utils'

export class PermissionGuard {
  static canActivate: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    return skipGuardIfAuthDisabled(() => {
      const employeeService = inject(EmployeeService)
      const messageService = inject(MessageService)
      const lang = inject(LocalService)

      const hasPermission = this._hasPermission(employeeService, route.data as PermissionRouteData)

      if (!hasPermission) {
        messageService.showError(lang.locals.you_dont_have_permission_to_access_this_page)
      }

      return hasPermission
    })
  }

  private static _hasPermission(service: EmployeeService, permissionRouteData: PermissionRouteData): boolean {
    if (permissionRouteData.hasAnyPermission) {
      return service.hasAnyPermission(permissionRouteData.permissions)
    }
    return service.hasAllPermission(permissionRouteData.permissions)
  }
}
