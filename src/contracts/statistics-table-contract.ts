import { LangKeysContract } from './lang-keys-contract'

export interface StatisticsTableContract<TData> {
  headerCols: (keyof LangKeysContract)[]
  items: TData[]
  keys: (keyof TData)[]
  searchKey: keyof TData
  header: keyof LangKeysContract
}
