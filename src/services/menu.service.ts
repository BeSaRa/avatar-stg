import { inject, Injectable } from '@angular/core'
import { MENU_ITEMS } from '../resources/menu-items'
import { EmployeeService } from './employee.service'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly employeeService = inject(EmployeeService)

  private readonly _menuItems = MENU_ITEMS

  getMenuItems() {
    return this._menuItems.filter(item =>
      item.permissions.length
        ? item.haveSomeOfPermissions
          ? this.employeeService.hasAnyPermission(item.permissions)
          : this.employeeService.hasAllPermission(item.permissions)
        : true
    )
  }

  getHomeItems() {
    return this.getMenuItems().filter(el => el.label != 'home')
  }
}
