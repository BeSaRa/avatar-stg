import { signal } from '@angular/core'
import { ALL_PERMISSIONS } from '../../../resources/all-permissions'
import { Permission } from '@/contracts/permission-contract'

/**
 * @deprecated
 */
export class ApplicationUser {
  private _permissions: Permission[] = []
  private _permissionsKeys: string[] = []
  private _refresh_token = signal<string>('')
  private _access_token = signal<string>('')
  private _user_id = signal<string>('')
  private _username = signal<string>('')

  isRefreshing = signal(false)

  get username(): string {
    return this._username()
  }
  set username(username: string) {
    this._username.set(username)
  }
  get user_id(): string {
    return this._user_id()
  }
  set user_id(userId: string) {
    this._user_id.set(userId)
  }

  set permissions(value: Permission[]) {
    this._permissions = value
    this._permissionsKeys = value.map(p => p.key)
  }
  get permissions(): Permission[] {
    return this._permissions
  }
  get permissionsKeys(): string[] {
    return this._permissionsKeys
  }

  get access_token(): string {
    return this._access_token()
  }
  set access_token(value: string) {
    this._access_token.set(value)
  }
  set refresh_token(value: string) {
    this._refresh_token.set(value)
  }
  get refresh_token(): string {
    return this._refresh_token()
  }

  hasPermission(permissionKey: keyof typeof ALL_PERMISSIONS): boolean {
    return this._permissionsKeys.includes(ALL_PERMISSIONS[permissionKey])
  }
  hasAnyPermission(permissionKeys: readonly (keyof typeof ALL_PERMISSIONS)[]): boolean {
    return permissionKeys.some(item => this._permissionsKeys.includes(ALL_PERMISSIONS[item]))
  }

  hasAllPermission(permissionKeys: readonly (keyof typeof ALL_PERMISSIONS)[]): boolean {
    return permissionKeys.every(item => this._permissionsKeys.includes(ALL_PERMISSIONS[item]))
  }

  hasToken(): boolean {
    return !!this.access_token && !this.isRefreshing()
  }
}
