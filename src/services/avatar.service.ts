import { StreamResultContract } from '@/contracts/stream-result-contract'
import { NO_ACCESS_TOKEN } from '@/http-contexts/no-access-token'
import { UrlService } from '@/services/url.service'
import { AppStore } from '@/stores/app.store'
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http'
import { inject, Injectable, NgZone, signal } from '@angular/core'
import { map, Observable, of, switchMap, tap, timer } from 'rxjs'
import { ConfigService } from './config.service'
import { StreamComponent } from '@/enums/stream-component'
import { EventSourcePlus, SseMessage } from 'event-source-plus' // or similar for @microsoft/fetch-event-source
import { CONFIGURATIONS } from '../resources/configurations'
import { TokenService } from './token.service'

@Injectable()
export class AvatarService {
  private readonly urlService = inject(UrlService)
  private readonly http = inject(HttpClient)
  private readonly store = inject(AppStore)
  private readonly config = inject(ConfigService)
  private readonly token = inject(TokenService)
  private readonly zone = inject(NgZone)

  componentName = signal<StreamComponent>(StreamComponent.AgentChatComponent)

  constructor() {
    if (!this.store.idleAvatar()) this.store.updateIdleAvatar(this.config.CONFIG.IDLE_AVATARS[0])
  }

  startStream(size?: 'life-size', useClientId = false): Observable<StreamResultContract> {
    return this.http
      .post<StreamResultContract>(
        this.urlService.URLS.AVATAR + '/start-stream',
        {},
        {
          params: {
            ...(size
              ? {
                  size: 'life-size',
                }
              : undefined),
            ...(this.store.clientId() && useClientId
              ? {
                  client_id: this.store.clientId(),
                }
              : undefined),
          },
        }
      )
      .pipe(tap(res => this.store.updateStreamIdFor(this.componentName(), res.data.id)))
  }

  connect(): Observable<string> {
    if (this.store.clientId()) {
      return of(this.store.clientId())
    }
    return this.http.post<{ client_id: string }>(this.urlService.URLS.AVATAR + '/connect', null).pipe(
      map(res => res.client_id),
      tap(id => this.store.updateClientId(id))
    )
  }

  startListener() {
    return new Observable<{ event: string; data: StreamResultContract }>(observer => {
      const { BASE_ENVIRONMENT: currentEnvironment, IS_OCP, KUNA_KEYS, OCP_APIM_KEYS } = this.config.CONFIG
      const eventSource = new EventSourcePlus(
        this.urlService.URLS.AVATAR + `/start-listener/${this.store.clientId()}`,
        {
          headers: {
            ...(this.token.hasAccessToken()
              ? {
                  [CONFIGURATIONS.TOKEN_HEADER_KEY]: `Bearer ${this.token.getAccessToken()}`,
                }
              : undefined),
            ...(IS_OCP
              ? { 'Ocp-Apim-Subscription-Key': OCP_APIM_KEYS[currentEnvironment] }
              : { 'x-functions-key': KUNA_KEYS[currentEnvironment] }),
          },
        }
      )

      const controller = eventSource.listen({
        onMessage: (message: SseMessage) => {
          this.zone.run(() => {
            observer.next(JSON.parse(message.data))
          })
        },
        onRequestError: context => {
          this.zone.run(() => {
            observer.error(context.error)
          })
          controller.abort('error')
        },
        onResponseError: context => {
          this.zone.run(() => {
            observer.error(new Error(`Response error: ${context.response.status}`))
          })
          controller.abort('error')
        },
      })

      // Cleanup on unsubscribe
      return () => controller.abort('manual')
    })
  }

  closeStream(): Observable<StreamResultContract> {
    const streamId = this.store.streamIdMap()[this.componentName()]
    this.store.updateStreamIdFor(this.componentName(), '')
    return this.http.delete<StreamResultContract>(this.urlService.URLS.AVATAR + `/close-stream/${streamId}`)
  }

  retrieveStream() {
    return this.http.get(
      this.urlService.URLS.AVATAR + `/retrieve-stream/${this.store.streamIdMap()[this.componentName()]}`
    )
  }

  checkStreamStatus() {
    return this.http.get(
      this.urlService.URLS.AVATAR + `/stream-status/${this.store.streamIdMap()[this.componentName()]}`
    )
  }

  sendCandidate(candidate: RTCIceCandidate): Observable<StreamResultContract> {
    return this.http.post<StreamResultContract>(
      this.urlService.URLS.AVATAR + `/send-candidate/${this.store.streamIdMap()[this.componentName()]}`,
      { candidate }
    )
  }

  sendAnswer(answer: RTCSessionDescriptionInit): Observable<StreamResultContract> {
    return this.http.put<StreamResultContract>(
      this.urlService.URLS.AVATAR + `/send-answer/${this.store.streamIdMap()[this.componentName()]}`,
      {
        answer,
      }
    )
  }

  interruptAvatar(): Observable<StreamResultContract> {
    return this.http.delete<StreamResultContract>(
      this.urlService.URLS.AVATAR + `/stop-render/${this.store.streamIdMap()[this.componentName()]}`
    )
  }

  renderText(text: string): Observable<unknown> {
    return this.http.post(
      this.urlService.URLS.AVATAR + `/render-text/${this.store.streamIdMap()[this.componentName()]}`,
      { text }
    )
  }

  updateVideo(text: string): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(this.urlService.URLS.AVATAR + '/update-video', { text })
  }

  retrieveVideo(): Observable<string> {
    return this.http.get<{ status: string; data: string }>(this.urlService.URLS.AVATAR + '/retrieve-video').pipe(
      switchMap(res => {
        if (res.status === 'RENDERING') {
          return timer(5000).pipe(switchMap(() => this.retrieveVideo()))
        }
        return of(res.data)
      })
    )
  }

  greeting(botName: string, isArabic: boolean) {
    const url = `${this.urlService.URLS.AVATAR}/greeting/${botName}/${this.store.streamIdMap()[this.componentName()]}`
    const params = new HttpParams().append('is_ar', isArabic)
    return this.http.post<void>(url, null, { params })
  }

  getMSICEServerInfo() {
    return this.http.get<{
      Urls: string[]
      Username: string
      Password: string
      ExpiresIn: number
    }>(`https://${this.store.speechToken.region()}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`, {
      context: new HttpContext().set(NO_ACCESS_TOKEN, true),
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.store.speechToken.token()}`),
    })
  }
}
