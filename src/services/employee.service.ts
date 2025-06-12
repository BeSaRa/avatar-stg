import { Injectable } from '@angular/core'
import { LoginData } from '@/models/login-data'
import { ALL_PERMISSIONS } from '../resources/all-permissions'

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private declare currentUser: LoginData | null

  hasAuthenticatedUser(): boolean {
    return !!this.currentUser
  }

  setCurrentUser(user: LoginData) {
    this.currentUser = user
  }

  getCurrentUser(): LoginData | null {
    return this.currentUser
  }

  removeCurrentUser() {
    this.currentUser = null
  }

  hasPermissionTo(permissionKey: keyof typeof ALL_PERMISSIONS): boolean {
    return !!this.currentUser && this.currentUser.permissionsKeys.includes(ALL_PERMISSIONS[permissionKey])
  }

  hasAnyPermission(permissionKeys: readonly (keyof typeof ALL_PERMISSIONS)[]): boolean {
    return (
      !!this.currentUser &&
      permissionKeys.some(item => this.currentUser!.permissionsKeys.includes(ALL_PERMISSIONS[item]))
    )
  }

  hasAllPermission(permissionKeys: readonly (keyof typeof ALL_PERMISSIONS)[]): boolean {
    return (
      !!this.currentUser &&
      permissionKeys.every(item => this.currentUser!.permissionsKeys.includes(ALL_PERMISSIONS[item]))
    )
  }

  isCurrentUserId(userId: string): boolean {
    return !!this.currentUser && this.currentUser.user_id === userId
  }
}
