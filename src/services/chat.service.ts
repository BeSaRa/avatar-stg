import { inject, Injectable, signal } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { UrlService } from '@/services/url.service'
import { catchError, exhaustMap, map, Observable } from 'rxjs'
import { Message } from '@/models/message'
import { AppStore } from '@/stores/app.store'
import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { formatString, formatText } from '@/utils/utils'
import { distinctUntilChanged, tap } from 'rxjs'
import { FormControl } from '@angular/forms'
import { LocalService } from './local.service'
import { MediaResultContract } from '@/contracts/media-result-contract'
import { STORAGE_ITEMS } from '@/constants/storage-items'
import { ApplicationUser } from '@/views/auth/models/application-user'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly store = inject(AppStore)
  private readonly lang = inject(LocalService)
  messages = signal<Message[]>([])
  status = signal<boolean>(false)
  conversationId = signal<string>('')

  sendMessage(content: string, bot: string): Observable<ChatMessageResultContract> {
    const url = `${this.urlService.URLS.CHAT}/${bot}`
    this.messages.update(messages => [...messages, new Message(content, 'user')])
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
        })
      )
      .pipe(
        map(res => {
          res.message.content = formatString(formatText(res.message.content, res.message))
          res.message = new Message().clone(res.message)
          this.conversationId.set(res.message.conversation_id)
          this.messages.update(messages => [...messages, res.message])
          return res
        })
      )
  }
  botNameCtrl = new FormControl('', { nonNullable: true })

  onBotNameChange() {
    return this.botNameCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.conversationId.set('')
        this.messages.set([])
      })
    )
  }
  uploadDocument(
    files: FileList,
    bot_name: string,
    conversation_id: string | null
  ): Observable<ChatMessageResultContract> {
    const url = `${this.urlService.URLS.CHATBOT_UPLOAD_DOCUMENT}`
    const formData = new FormData()

    Array.from(files).forEach(file => {
      formData.append('files', file, file.name)
    })

    let params = new HttpParams().set('bot_name', bot_name)
    if (conversation_id) {
      params = params.set('conversation_id', conversation_id)
    }

    return this.http.post<MediaResultContract<string>>(url, formData, { params }).pipe(
      map(response => {
        this.conversationId.set(response.data || '')
        return response.data
      }),
      exhaustMap(() =>
        this.sendMessage('summarize', bot_name).pipe(
          catchError(err => {
            console.error('Error sending summarize message:', err)
            throw err
          })
        )
      ),
      catchError(err => {
        console.error('Error uploading document:', err)
        throw err
      })
    )
  }
  getUserId() {
    const userItem = localStorage.getItem(STORAGE_ITEMS.USER)
    let userId = ''
    if (userItem) {
      userId = (JSON.parse(userItem) as ApplicationUser).user_id
    }
    return userId
  }
}
