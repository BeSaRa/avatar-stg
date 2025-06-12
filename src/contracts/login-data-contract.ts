import { Permission } from '@/contracts/permission-contract'

export interface LoginDataContract {
  access_token: string
  refresh_token: string
  user_id: string
  username: string
  permissions: Permission[]
}
