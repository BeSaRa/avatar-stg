export interface User {
  PartitionKey: string
  RowKey: string
  user_id: string
  username: string
  never_expire: boolean
}
