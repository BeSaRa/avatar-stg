import { fadeInSlideUp, slideFromBottom } from '@/animations/fade-in-slide'
import { URL_PATTERN } from '@/constants/url-pattern'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { WebCrawlerService } from '@/services/web-crawler.service'
import { convertMarkdownToHtmlHeaders, formatString, formatText, markAllControlsAsTouchedAndDirty } from '@/utils/utils'
import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip'
import { catchError, EMPTY, finalize, from, Observable, switchMap, takeUntil, tap } from 'rxjs'
import { CrawlerUrl, MediaCrawler } from '@/models/media-crawler'
import { GenerteReportContract } from '@/contracts/generate-report-contract'
import { ChipsInputComponent } from '@/components/chips-input/chips-input.component'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { AdminService } from '@/services/admin.service'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { MediaResultContract } from '@/contracts/media-result-contract'

@Component({
  selector: 'app-web-crawler-report',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatTooltipModule, NgTemplateOutlet, ChipsInputComponent, SanitizerPipe],
  templateUrl: './web-crawler-report.component.html',
  styleUrl: './web-crawler-report.component.scss',
  animations: [fadeInSlideUp, slideFromBottom],
})
export class WebCrawlerReportComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  crawlerService = inject(WebCrawlerService)
  adminService = inject(AdminService)
  fb = inject(NonNullableFormBuilder)
  reportName = signal('')
  isValidReport = signal(false)
  reportTxt = signal('')
  loaderUrl = signal<boolean>(false)
  loaderTopic = signal<boolean>(false)
  inputURLS = viewChildren<ElementRef<HTMLInputElement>>('inputURLS')
  inputTopics = viewChildren<ElementRef<HTMLInputElement>>('inputTopics')
  crawlerForm = this.fb.group({
    topics: this.fb.array([this.fb.control('', Validators.required)]),
    urls: this.fb.array([this.fb.control('', [Validators.required, Validators.pattern(URL_PATTERN)])]),
  })
  reportForm = this.fb.group(
    {
      search_text: this.fb.control(null, Validators.required),
      index_date_from: this.fb.control(null),
      index_date_to: this.fb.control(null),
      news_date_from: this.fb.control(null),
      news_date_to: this.fb.control(null),
      tags: this.fb.control([]),
    },
    { validators: [this.dateRangeValidator, this.futureIndexDateValidator] }
  )
  animateTrigger = signal<boolean>(false)
  isApproved = signal(false)

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const indexFrom = group.get('index_date_from')?.value
    const indexTo = group.get('index_date_to')?.value
    const newsFrom = group.get('news_date_from')?.value
    const newsTo = group.get('news_date_to')?.value

    const errors: ValidationErrors = {}

    if (indexFrom && indexTo && indexFrom > indexTo) {
      errors['indexDateRangeInvalid'] = true
    }

    if (newsFrom && newsTo && newsFrom > newsTo) {
      errors['newsDateRangeInvalid'] = true
    }

    return Object.keys(errors).length > 0 ? errors : null
  }

  futureIndexDateValidator(group: AbstractControl): ValidationErrors | null {
    const today = new Date().toISOString().split('T')[0]
    const fields = ['index_date_to']

    for (const field of fields) {
      const control = group.get(field)
      if (control?.value && control.value > today) {
        return { futureDateInvalid: true }
      }
    }

    return null
  }

  get topics(): FormArray {
    return this.crawlerForm.get('topics') as FormArray
  }

  get urls(): FormArray {
    return this.crawlerForm.get('urls') as FormArray
  }

  // Add a new topic
  addTopic() {
    this.topics.push(this.fb.control('', Validators.required))
  }

  // Add a new URL
  addUrl() {
    this.urls.push(this.fb.control('', [Validators.required, Validators.pattern(URL_PATTERN)]))
  }

  // Remove a topic by index
  removeTopic(index: number) {
    this.topics.removeAt(index)
  }

  // Remove a URL by index
  removeUrl(index: number) {
    this.urls.removeAt(index)
  }

  focusLastInput(type: 'topic' | 'urls') {
    const timer = setTimeout(() => {
      const inputs = type === 'topic' ? this.inputTopics() : this.inputURLS()
      const lastIdx = inputs.length - 1
      inputs[lastIdx]?.nativeElement.focus()
      clearTimeout(timer)
    })
  }
  removeOnErase(curr: number, type: 'topic' | 'urls') {
    const inputs = type === 'topic' ? this.inputTopics() : this.inputURLS()
    const remover = type === 'topic' ? this.removeTopic : this.removeUrl
    const value = inputs[curr].nativeElement.value
    if (!value && curr > 0) {
      remover.bind(this)(curr)
      if (curr > 0) {
        inputs[curr - 1].nativeElement.focus()
      }
    }
  }

  crawlWebPages() {
    this.crawlerForm.markAllAsTouched()
    this.crawlerForm.controls.topics.controls.forEach(c => c.markAsDirty())
    this.crawlerForm.controls.urls.controls.forEach(c => c.markAsDirty())
    if (this.crawlerForm.invalid) return
    const data = this.crawlerForm.getRawValue()
    const contract = new MediaCrawler()
    contract.settings.topics = data.topics
    contract.urls = data.urls.map((url: string) => new CrawlerUrl(url, data.topics, true))
    contract.urls.forEach(url => {
      delete url.cookies
      delete url.headers
      delete url.payload
    })
    console.log(contract)
    this.loaderTopic.set(true)
    this.crawlerService
      .crawlWebPages(contract)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.loaderTopic.set(false)))
      .subscribe()
  }

  generateReport(): void {
    if (this.reportForm.invalid) {
      markAllControlsAsTouchedAndDirty(this.reportForm)
      return
    }

    this.loaderUrl.set(true)

    const reportFilter = this.createReportFilter()

    this.crawlerService
      .generateReport(reportFilter)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.animateTrigger.set(!this.animateTrigger())),
        switchMap(res => this.handleGenerateReport(res)),
        switchMap(file => {
          if (!file) return EMPTY
          return this.adminService.uploadBlobs([file], {
            container_name: 'rera-media-reports',
            subfolder_name: 'links',
          })
        }),
        finalize(() => this.loaderUrl.set(false)),
        catchError(error => {
          console.error('Error generating report:', error)
          return []
        })
      )
      .subscribe()
  }

  private createReportFilter(): Partial<GenerteReportContract> {
    return Object.fromEntries(
      Object.entries(this.reportForm.value).filter(([, value]) =>
        Array.isArray(value) ? value && value.length > 0 : Boolean(value)
      )
    )
  }

  private isValidReportResponse(
    res: MediaResultContract<{ final_response: ChatMessageResultContract; references: string[]; report_url: string }>
  ): boolean {
    return res?.status_code === 201 && !!res?.data?.final_response?.message?.content
  }

  private updateReportView(data: {
    final_response: ChatMessageResultContract
    references: string[]
    report_url: string
  }): void {
    const { final_response } = data
    const formattedContent = formatString(
      formatText(convertMarkdownToHtmlHeaders(final_response.message.content), final_response.message)
    )
    this.reportTxt.set(formattedContent)
    this.reportName.set(this.reportForm.value.search_text!)
  }

  private handleGenerateReport(
    res: MediaResultContract<{ final_response: ChatMessageResultContract; references: string[]; report_url: string }>
  ): Observable<File | null> {
    const isValid = this.isValidReportResponse(res)
    this.isValidReport.set(isValid)

    if (res?.data) {
      this.updateReportView(res.data)
    }

    if (!isValid) return EMPTY

    return from(this.generatePdfBlob())
  }

  async downloadPdf() {
    const file = await this.generatePdfBlob()
    if (file) {
      const blobUrl = URL.createObjectURL(file)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = this.reportName()
      a.click()

      URL.revokeObjectURL(blobUrl)
    }
  }

  generatePdfBlob(): Promise<File> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = document.getElementById('pdf-content')
        if (!data) return reject('PDF content element not found.')

        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
        })

        const margin = 15
        const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2
        const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2

        html2canvas(data, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: data.scrollWidth,
        })
          .then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0)
            const imgHeight = (canvas.height * pdfWidth) / canvas.width

            let heightLeft = imgHeight
            let position = margin

            pdf.addImage(imgData, 'JPEG', margin, position, pdfWidth, imgHeight)
            heightLeft -= pdfHeight

            while (heightLeft > 0) {
              position = heightLeft - imgHeight + margin
              pdf.addPage()
              pdf.addImage(imgData, 'JPEG', margin, position, pdfWidth, imgHeight)
              heightLeft -= pdfHeight
            }

            const totalPages = pdf.getNumberOfPages()
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i)
              pdf.setFontSize(8)
              const text = `${i} / ${totalPages}`
              pdf.text(text, pdf.internal.pageSize.getWidth() - margin, pdf.internal.pageSize.getHeight() - 5, {
                align: 'right',
              })
            }

            const blob = pdf.output('blob')
            const file = new File([blob], `${this.reportName()}.pdf`, { type: 'application/pdf' })
            resolve(file)
          })
          .catch(reject)
      }, 0)
    })
  }
}
