import { ChartConfiguration } from 'chart.js'

export interface AdminInsightStatistics<TData> {
  status: number
  message: string
  data: TData
}
1
export interface BotNameOverviewData {
  bot_name: string
  total_tokens: number
}

export interface SessionResultData {
  success_rate: number
  total_messages: number
  total_queries: number
  active_users: number
}

export interface UsageResultData {
  average_response_time: number
  average_token_value: number
  average_duration: number
}

export interface InappropriateResultsData {
  total_inappropriate_messages: number
  messages: AnswerQuestionData[]
}

export interface AnswerQuestionData {
  question: string
  answer: string | null
}

export type TokenResultData = AnswerQuestionData[]
export type ResponseTimeResultData = AnswerQuestionData[]

export interface UserStatisticsData {
  device_info: DeviceInfoData[]
  region: RegionData[]
}

interface BaseUserData {
  PartitionKey: string
  RowKey: string
  bot_name: string
  date: string
  Count: number
}

export interface DeviceInfoData extends BaseUserData {
  device_type: string
}

export interface RegionData extends BaseUserData {
  Region: string
  country: string
}

export interface AdminInsightsStats {
  sessionResult: SessionResultData
  usageResult: UsageResultData
  botOverview: { chart: ChartConfiguration }
  inappropriateResult: InappropriateResultsData
  reponseTimeResult: ResponseTimeResultData
  tokenResult: TokenResultData
  deviceInfo: { chart: ChartConfiguration }
  regionInfo: { chart: ChartConfiguration }
}
