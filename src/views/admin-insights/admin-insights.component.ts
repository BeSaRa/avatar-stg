import { AnswerQuestionData } from './../../contracts/admin-insights-contract'
import { LocalService } from '@/services/local.service'
import { AdminInsightsService } from './../../services/admin-insights.service'
import { Component, inject, signal } from '@angular/core'
import { map, tap } from 'rxjs'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { dateRangeValidator, markAllControlsAsTouchedAndDirty } from '@/utils/utils'
import { ButtonDirective } from '@/directives/button.directive'
import { ChatHistoryService } from '@/services/chat-history.service'
import { AsyncPipe, DecimalPipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import {
  AdminInsightsStats,
  BotNameOverviewData,
  DeviceInfoData,
  RegionData,
} from '@/contracts/admin-insights-contract'
import { ChartConfiguration, ChartOptions } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { MatDialog } from '@angular/material/dialog'
import { QuestionAnswerPopupComponent } from '@/components/question-answer-popup/question-answer-popup.component'

@Component({
  selector: 'app-admin-insights',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonDirective,
    AsyncPipe,
    KeyValuePipe,
    BaseChartDirective,
    DecimalPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './admin-insights.component.html',
  styleUrl: './admin-insights.component.scss',
})
export default class AdminInsightsComponent extends OnDestroyMixin(class {}) {
  private readonly adminInsightsService = inject(AdminInsightsService)
  private readonly chatHistoryService = inject(ChatHistoryService)
  protected readonly lang = inject(LocalService)
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly dialog = inject(MatDialog)
  statistics = signal<AdminInsightsStats | null>(null)
  botNames$ = this.chatHistoryService.getAllBotNames().pipe(
    tap(bots => this.filterForm.controls.botName.patchValue(bots.at(0)!)),
    tap(() => this.loadStatistics())
  )

  filterForm = this.fb.group(
    {
      from_date: this.fb.control(''),
      to_date: this.fb.control(''),
      botName: this.fb.control('', Validators.required),
    },
    { validators: dateRangeValidator([['from_date', 'to_date']], ['DateInvalidRangeIndexed']) }
  )

  loadStatistics() {
    const { from_date, to_date, botName } = this.filterForm.value
    if (this.filterForm.invalid) {
      markAllControlsAsTouchedAndDirty(this.filterForm)
      return
    }
    // in order to make the loading run
    this.statistics.set(null)
    this.adminInsightsService
      .getInsights(botName!, from_date, to_date)
      .pipe(
        map(
          ({
            sessionResult,
            usageResult,
            botOverview,
            inappopriateResult,
            responiseTimeResult,
            tokenResult,
            userStatistics,
          }) => ({
            sessionResult: sessionResult.data,
            usageResult: usageResult.data,
            inappropriateResult: inappopriateResult.data,
            reponseTimeResult: responiseTimeResult.data,
            tokenResult: tokenResult.data,
            botOverview: {
              chart: this.getBotTokensChartConfig(botOverview.data.total_tokens_per_bot),
            },
            deviceInfo: {
              chart: this.getDeviceTypeChartConfig(userStatistics.data.device_info),
            },
            regionInfo: {
              chart: this.getCountryRegionChartConfig(userStatistics.data.region),
            },
          })
        ),
        tap(value => this.statistics.set(value)),
        tap(() => console.log(this.filterForm))
      )
      .subscribe()
  }

  getBotTokensChartConfig(data: BotNameOverviewData[], normalizeNames = true): ChartConfiguration {
    const botMap = new Map<string, { originalName: string; total: number }>()

    data.forEach(item => {
      const rawName = item.bot_name
      const normalizedName = normalizeNames ? rawName.trim().toLowerCase() : rawName

      const displayName = normalizeNames ? normalizedName : rawName

      const existing = botMap.get(normalizedName)
      if (existing) {
        existing.total += item.total_tokens
      } else {
        botMap.set(normalizedName, {
          originalName: displayName,
          total: item.total_tokens,
        })
      }
    })

    const sorted = Array.from(botMap.entries())
      .filter(([, obj]) => obj.total > 0)
      .sort((a, b) => b[1].total - a[1].total)

    const labels = sorted.map(([, obj]) => obj.originalName)
    const values = sorted.map(([, obj]) => obj.total)

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Tokens per Bot',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192)',
            borderWidth: 2,
            borderRadius: 4,
          },
        ],
      },
      options: this.getChartOptions(),
    }
  }

  getDeviceTypeChartConfig(deviceInfo: DeviceInfoData[], normalize = true): ChartConfiguration {
    const typeMap = new Map<string, number>()

    for (const entry of deviceInfo) {
      const raw = entry.device_type
      const key = normalize ? raw.trim().toLowerCase() : raw

      typeMap.set(key, (typeMap.get(key) || 0) + entry.Count)
    }

    const sorted = Array.from(typeMap.entries())
      .filter(([, count]) => count > 0)
      .sort((a, b) => a[1] - b[1])

    const labels = sorted.map(([type]) => type)
    const values = sorted.map(([, count]) => count)

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Count per Device Type',
            data: values,
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255)',
            borderWidth: 2,
          },
        ],
      },
      options: this.getChartOptions(),
    }
  }
  getCountryRegionChartConfig(regionData: RegionData[], normalize = true): ChartConfiguration {
    const countryRegionMap = new Map<string, Map<string, number>>()
    for (const item of regionData) {
      if (!item.country || !item.Region) continue

      const rawCountry = item.country
      const rawRegion = item.Region

      const country = normalize ? rawCountry.trim().toLowerCase() : rawCountry
      const region = normalize ? rawRegion.trim().toLowerCase() : rawRegion

      if (!countryRegionMap.has(country)) {
        countryRegionMap.set(country, new Map())
      }

      const regionMap = countryRegionMap.get(country)!
      regionMap.set(region, (regionMap.get(region) || 0) + item.Count)
    }

    const countries = Array.from(countryRegionMap.keys()).sort()
    const allRegions = Array.from(
      new Set(Array.from(countryRegionMap.values()).flatMap(regionMap => Array.from(regionMap.keys())))
    ).sort()

    const datasets = allRegions.map(region => {
      const data = countries.map(country => {
        const regionMap = countryRegionMap.get(country)!
        return regionMap.get(region) || 0
      })

      return {
        label: region,
        data,
        backgroundColor: this.getColorForRegion(region),
        borderColor: this.getColorForRegion(region),
        borderWidth: 1,
      }
    })

    return {
      type: 'bar',
      data: {
        labels: countries,
        datasets,
      },
      options: {
        ...this.getChartOptions(),
        responsive: true,
        indexAxis: 'x',

        scales: {
          x: { stacked: true },
          y: { beginAtZero: true, stacked: true },
        },
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Users by Region and Country' },
        },
      },
    }
  }

  getChartOptions(): ChartOptions {
    return {
      font: {
        size: 18,
      },
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: true },
        tooltip: {
          rtl: this.lang.currentLanguage === 'ar',
        },
      },
      scales: {
        x: { beginAtZero: true },
        y: { ticks: { font: { size: 12 }, autoSkip: false } },
      },
    }
  }

  getColorForRegion(region: string): string {
    const colors = [
      '#4dc9f6',
      '#f67019',
      '#f53794',
      '#537bc4',
      '#acc236',
      '#166a8f',
      '#00a950',
      '#58595b',
      '#8549ba',
      '#c9cbcf',
      '#ff6384',
      '#36a2eb',
      '#cc65fe',
      '#ffce56',
      '#33cc99',
      '#ff9966',
      '#6699ff',
      '#ffcc00',
      '#00cccc',
      '#9966cc',
    ]
    let hash = 0
    for (let i = 0; i < region.length; i++) {
      hash = region.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  openQuestionAnswerDialog(data: AnswerQuestionData[], title: string) {
    this.dialog.open<QuestionAnswerPopupComponent, { questoinsAnswers: AnswerQuestionData[]; title: string }>(
      QuestionAnswerPopupComponent,
      {
        data: {
          questoinsAnswers: data,
          title,
        },
      }
    )
  }

  onReset(): void {
    this.filterForm.controls.from_date.reset()
    this.filterForm.controls.to_date.reset()
    this.loadStatistics()
  }
}
