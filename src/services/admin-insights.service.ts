import {
  InappropriateResultsData,
  ResponseTimeResultData,
  SessionResultData,
  TokenResultData,
  UsageResultData,
  UserStatisticsData,
} from './../contracts/admin-insights-contract'
import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { combineLatest, Observable } from 'rxjs'
import { AdminInsightStatistics, BotNameOverviewData } from '@/contracts/admin-insights-contract'

@Injectable({
  providedIn: 'root',
})
export class AdminInsightsService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  getBotsOverView(
    fromDate?: string,
    toDate?: string
  ): Observable<AdminInsightStatistics<{ total_tokens_per_bot: BotNameOverviewData[] }>> {
    return this.getWithParams('/bots-overview', fromDate, toDate)
  }

  getSessionResults(
    botName: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AdminInsightStatistics<SessionResultData>> {
    return this.getWithBotName('/session-results', botName, fromDate, toDate)
  }

  getUsageResults(
    botName: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AdminInsightStatistics<UsageResultData>> {
    return this.getWithBotName('/usage-results', botName, fromDate, toDate)
  }

  getInappropriateResults(
    botName: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AdminInsightStatistics<InappropriateResultsData>> {
    return this.getWithBotName('/inappropriate-results', botName, fromDate, toDate)
  }

  getResponseTimeResults(
    botName: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AdminInsightStatistics<ResponseTimeResultData>> {
    return this.getWithBotName('/response-time-results', botName, fromDate, toDate)
  }

  getTokenResults(
    botName: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AdminInsightStatistics<TokenResultData>> {
    return this.getWithBotName('/token-results', botName, fromDate, toDate)
  }

  getUserStatistics(
    botName: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AdminInsightStatistics<UserStatisticsData>> {
    return this.getWithBotName('/user-statistics', botName, fromDate, toDate)
  }

  getInsights(botName: string, fromDate?: string, toDate?: string) {
    return combineLatest({
      botOverview: this.getBotsOverView(fromDate, toDate),
      inappopriateResult: this.getInappropriateResults(botName, fromDate, toDate),
      responiseTimeResult: this.getResponseTimeResults(botName, fromDate, toDate),
      sessionResult: this.getSessionResults(botName, fromDate, toDate),
      tokenResult: this.getTokenResults(botName, fromDate, toDate),
      usageResult: this.getUsageResults(botName, fromDate, toDate),
      userStatistics: this.getUserStatistics(botName, fromDate, toDate),
    })
  }

  private getWithParams<T>(endpoint: string, fromDate?: string, toDate?: string) {
    const url = `${this.urlService.URLS.ADMIN}${endpoint}`
    const params = this.buildParams(fromDate, toDate)
    return this.http.get<T>(url, { params })
  }

  private getWithBotName<T>(endpoint: string, botName: string, fromDate?: string, toDate?: string) {
    const params = this.buildParams(fromDate, toDate).set('bot_name', botName)
    const url = `${this.urlService.URLS.ADMIN}${endpoint}`
    return this.http.get<T>(url, { params })
  }

  private buildParams(fromDate?: string, toDate?: string): HttpParams {
    let params = new HttpParams()
    if (fromDate) params = params.set('from_date', fromDate)
    if (toDate) params = params.set('to_date', toDate)
    return params
  }
}
