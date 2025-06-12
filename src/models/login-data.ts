import { LoginDataContract } from '@/contracts/login-data-contract'
import { Permission } from '@/contracts/permission-contract'

export class LoginData implements LoginDataContract {
  declare access_token: string
  declare refresh_token: string
  declare user_id: string
  declare username: string
  declare permissions: Permission[]
  declare permissionsKeys: string[]

  preparePermissions() {
    this.permissionsKeys = this.permissions.map(item => item.key)
    return this
  }
}
