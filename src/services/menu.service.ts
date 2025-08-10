import { inject, Injectable } from '@angular/core'
import { MENU_ITEMS } from '../resources/menu-items'
import { EmployeeService } from './employee.service'
import { FeatureToggleService } from './feature-toggle.service'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly employeeService = inject(EmployeeService)
  private readonly featureToggle = inject(FeatureToggleService)

  private readonly _menuItems = MENU_ITEMS

  getMenuItems() {
    const isAuthEnabled = this.featureToggle.isAuthEnabled()

    return this._menuItems.filter(item => {
      if (item.feature && !this.featureToggle.isFeatureEnabled(item.feature)) {
        return false
      }

      if (!isAuthEnabled) {
        return true
      }

      if (!item.permissions?.length) {
        return true
      }

      return item.haveSomeOfPermissions
        ? this.employeeService.hasAnyPermission(item.permissions)
        : this.employeeService.hasAllPermission(item.permissions)
    })
  }

  getHomeItems() {
    return this.getMenuItems().filter(el => el.label != 'home')
  }
}
