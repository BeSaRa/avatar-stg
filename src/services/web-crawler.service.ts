import { inject, Injectable } from '@angular/core'
import { UrlService } from './url.service'
import { HttpClient } from '@angular/common/http'
import { MediaResultContract } from '@/contracts/media-result-contract'
import { Observable } from 'rxjs'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { MediaCrawler } from '@/models/media-crawler'
import { GenerteReportContract } from '@/contracts/generate-report-contract'

@Injectable({
  providedIn: 'root',
})
export class WebCrawlerService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)

  generateReport(
    generateReportFilter: Partial<GenerteReportContract>
  ): Observable<
    MediaResultContract<{ final_response: ChatMessageResultContract; references: string[]; report_url: string }>
  > {
    const url = `${this.urlService.URLS.MEDIA}/generate-report`
    return this.http.post<
      MediaResultContract<{ final_response: ChatMessageResultContract; references: string[]; report_url: string }>
    >(url, generateReportFilter)
  }

  crawlWebPages(crawlingData: MediaCrawler): Observable<MediaResultContract> {
    const url = `${this.urlService.URLS.MEDIA}/crawl`
    return this.http.post<MediaResultContract>(url, crawlingData)
  }
}
