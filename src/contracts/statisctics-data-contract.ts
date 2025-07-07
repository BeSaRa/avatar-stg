import { ChartConfiguration } from 'chart.js'

export interface StatisticsData {
  mostIndexedChart: { title: string; chart: ChartConfiguration; viewDetails?: () => void }
  mostUsedKeywordsChart: { title: string; chart: ChartConfiguration; viewDetails?: () => void }
  newsPercentageChart: { title: string; chart: ChartConfiguration }
  totalIndexedNewsCount: number
}
