import { inject, Injectable, signal } from '@angular/core'
import { BaseChatService } from './base-chat.service'
import { Message } from '@/models/message'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { catchError, filter, map, Observable, Subject, switchMap, tap } from 'rxjs'
import { StreamComponent } from '@/enums/stream-component'
import { VideoData, VideoSearchResult } from '@/contracts/media-video-result-contract'
import { InsightsContract } from '@/contracts/insights'
import { MatDialog } from '@angular/material/dialog'
import { ListVideosPopupComponent } from '@/components/list-videos-popup/list-videos-popup.component'

type ActionKey =
  | 'search_by_id'
  | 'get_video_index'
  | 'list_all_videos'
  | 'get_complete_video_details'
  | 'search_all_videos'

type ActionEnvelope = Record<ActionKey, string>

type ActionHandlers = {
  [K in ActionKey]: (payload: ActionMapType[K]) => void
}

export interface ActionMapType {
  list_all_videos: VideoData[]
  get_video_index: {
    res_data: InsightsContract
    summary: string
    video_download_url: string
    video_stream_url: string
    video_caption: string
    audio_stream_url: string
  }
  search_by_id: {
    video?: VideoData | null
  }
  get_complete_video_details: {
    video?: VideoData | null
  }
  search_all_videos: VideoData[]
}

@Injectable({
  providedIn: 'root',
})
export class VideoIndexerChatService extends BaseChatService {
  messages = signal<Message[]>([])
  status = signal(false)
  override conversationId = signal('')
  override componentName = signal(StreamComponent.VideoAnalyzerComponent)
  override streamResponse = signal(false)
  selectedItem = signal<VideoData | undefined>(undefined)
  private _videoInsights = new Subject<ActionMapType['get_video_index'] & { selectedItem: VideoData }>()
  videoInsights$ = this._videoInsights.asObservable()
  private readonly dialog = inject(MatDialog)

  override sendMessage(content: string): Observable<ChatMessageResultContract> {
    const url = `${this.urlService.URLS.AGENT_CHAT}/video_indexer`
    const isChooseVideoMessage = this.isChooseVideoMessage(content)
    const msg = new Message(content, 'user')
    msg.hidden = isChooseVideoMessage
    this.messages.update(messages => [...messages, msg])
    return this.http
      .post<ChatMessageResultContract>(url, {
        messages: this.messages(),
        ...(this.store.streamId() ? { stream_id: this.store.streamId() } : null),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : null),
        ...(this.getUserId() ? { user_id: this.getUserId() } : null),
      })
      .pipe(
        catchError(err => {
          new Message().clone({
            content: err.message,
            role: 'error',
          })
          throw new Error(err)
        }),
        tap(res => {
          if (res?.action_results?.length) {
            this.handleActionResult(res.action_results as ActionEnvelope[])
          }
        }),
        map(res => {
          res.content = this.markdownService.parse(res.content, {
            disableSanitizer: true,
            markedOptions: { async: false, breaks: false },
          }) as string
          const assistantMessage = new Message('', 'assistant')
          assistantMessage.content = res.content
          this.conversationId.set(res.conversation_id)
          this.messages.update(messages => [...messages, assistantMessage])
          return res
        })
      )
  }

  private transformers: { [K in ActionKey]: (json: unknown) => ActionMapType[K] } = {
    list_all_videos: (json: unknown) => {
      const obj = json as { data: { videos: VideoData[] } }
      const videos = obj?.data?.videos ?? []
      return videos
    },

    get_video_index: (json: unknown) => {
      const o = json as ActionMapType['get_video_index']
      return {
        res_data: o.res_data,
        summary: o.summary,
        video_download_url: o.video_download_url,
        video_stream_url: o.video_stream_url,
        video_caption: o.video_caption,
        audio_stream_url: o.audio_stream_url,
      }
    },

    search_by_id: (json: unknown) => {
      const obj = json as { video?: VideoData | null }
      return { video: obj?.video ?? null }
    },
    get_complete_video_details: (json: unknown) => {
      const obj = json as { video?: VideoData | null }
      return { video: obj?.video ?? null }
    },
    search_all_videos: (json: unknown) => {
      const obj = json as { data: { text_segments: VideoSearchResult[] } }
      const videos = obj?.data?.text_segments.map(
        (item: VideoSearchResult) =>
          ({
            id: item.video_id,
            name: item.video_name,
            text: item.text,
            thumbnail_url: '',
          }) as VideoData
      )
      const uniqueVideos = new Array(...new Set(videos.map(video => video.id))).map(u => videos.find(v => v.id === u)!)

      return uniqueVideos
    },
  }

  isActionKey(x: string): x is ActionKey {
    return (
      x === 'search_by_id' ||
      x === 'get_video_index' ||
      x === 'list_all_videos' ||
      x === 'get_complete_video_details' ||
      x === 'search_all_videos'
    )
  }

  handleActionResult(actionResult: ActionEnvelope[]) {
    const filteredActionResult = actionResult.find(el => el?.get_video_index)
    const results = filteredActionResult ? [filteredActionResult] : actionResult
    for (const item of results) {
      for (const [key, raw] of Object.entries(item)) {
        if (!this.isActionKey(key) || typeof raw !== 'string') {
          console.warn('Unknown or invalid action entry:', key, raw)
          continue
        }
        this.dispatch(key, raw)
      }
    }
  }

  private dispatch<K extends ActionKey>(key: K, raw: string) {
    const parsed = this.safeParse(raw)
    if (!parsed.ok) {
      console.error(`JSON parse failed for ${key}:`, parsed.error, { raw })
      return
    }
    const payload = this.transformers[key](parsed.value) as ActionMapType[K]
    this.handlers[key](payload)
  }
  handlers: ActionHandlers = {
    list_all_videos: (payload: VideoData[]) => {
      this.openVideoList(payload)
    },

    get_video_index: (payload: {
      res_data: InsightsContract
      summary: string
      video_download_url: string
      video_stream_url: string
      video_caption: string
      audio_stream_url: string
    }) => {
      const videoData: VideoData = {
        id: payload.res_data.id,
        name: payload.res_data.name,
        thumbnail_url: payload.res_data.videos[0]?.thumbnail_url,
      }
      this.selectedItem.set(videoData)
      this._videoInsights.next({ ...payload, selectedItem: this.selectedItem()! })
    },

    search_by_id: ({ video }) => {
      console.log(video)
    },
    get_complete_video_details: ({ video }) => {
      console.log(video)
    },
    search_all_videos: (payload: VideoData[]) => {
      if (!payload || !payload.length) return
      this.openVideoList(payload)
    },
  }

  private safeParse<T = unknown>(raw: string): { ok: true; value: T } | { ok: false; error: Error } {
    try {
      return { ok: true, value: JSON.parse(raw) as T }
    } catch (e) {
      return { ok: false, error: e as Error }
    }
  }

  openVideoList(videos: VideoData[]) {
    this.dialog
      .open<ListVideosPopupComponent, { videos: VideoData[] }, VideoData>(ListVideosPopupComponent, {
        data: { videos },
      })
      .afterClosed()
      .pipe(
        filter(selectedVideo => Boolean(selectedVideo)),
        tap(selectedVideo => this.selectedItem.set(selectedVideo)),
        switchMap(selectedVideo => this.sendMessage(`اختر المعرف رقم : ${selectedVideo?.id}`))
      )
      .subscribe()
  }

  isChooseVideoMessage(msg: string, selectedId?: string): boolean {
    const MSG_RE = /^\s*["']?اختر\s+المعرف\s+رقم\s*[:\u061B\uFF1A]\s*([A-Za-z0-9_-]+)["']?\s*$/u
    const match = msg.match(MSG_RE)
    if (!match) return false

    return selectedId ? match[1] === selectedId : true
  }

  //   toMiniCard(src: string): string {
  //     const RE_VIDEO = /-\s*الفيديو\s*ID:\s*([A-Za-z0-9_-]+)\s*[\r\n]+\s*-\s*([^\r\n]+)/gi

  //     const matches = [...src.matchAll(RE_VIDEO)]

  //     if (!matches.length) {
  //       return src
  //     }

  //     return matches
  //       .map(match => {
  //         const [, id, desc] = match
  //         return `<div
  //   class="flex flex-col gap-2 p-3
  //    my-2 border border-gray-200 rounded-xl
  //    bg-secondary-100/80 shadow-sm
  // cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none"
  //   role="button" tabindex="0"
  //   data-video-id="${id.trim()}">
  //   <div class="flex items-center gap-2 mb-2">
  //     <span class="text-sm font-semibold text-gray-500">ID</span>
  //     <code class="text-sm font-medium text-primary">${id.trim()}</code>
  //   </div>
  //   <p class="text-sm text-gray-700">${desc.trim()}</p>
  // </div>`
  //       })
  //       .join('')
  //   }
}
