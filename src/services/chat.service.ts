import { inject, Injectable, signal } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { UrlService } from '@/services/url.service'
import {
  catchError,
  defer,
  delay,
  exhaustMap,
  expand,
  filter,
  from,
  map,
  Observable,
  switchMap,
  takeWhile,
  throwError,
} from 'rxjs'
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
  showLegal = signal(false)
  messageInProgress = signal(false)
  chatType?: string
  inProgressAssisstantMessage = ''
  declare controller: AbortController | null

  sendMessage(content: string, bot: string, chatType?: string): Observable<ChatMessageResultContract> {
    this.chatType = chatType ?? bot

    const url = `${this.urlService.URLS.CHAT}/${bot}`
    this.messages.update(messages => [...messages, new Message(content, 'user', chatType ?? bot)])
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
            chatType: chatType ?? bot,
          })
          throw new Error(err)
        })
      )
      .pipe(
        map(res => {
          res.message.content = formatString(formatText(res.message.content, res.message))
          res.message = new Message().clone<Message>({ ...res.message, chatType: chatType ?? bot })
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

  getFilteredMessages(chatType?: string) {
    const _type = chatType ?? this.chatType
    return this.messages().filter(m => (_type ? _type === m.chatType : true))
  }

  sendMessageStreamed(content: string, bot: string) {
    const userMessage = new Message(content, 'user')
    this.updateMessages(userMessage)
    this.inProgressAssisstantMessage = ''

    return defer(() => {
      const controller = new AbortController()
      this.controller = controller
      const abortSignal = controller.signal
      this.messageInProgress.set(true)

      const url = `${this.urlService.URLS.AGENT_CHAT}/stream/${bot}`
      const body = JSON.stringify({
        messages: this.messages(),
        ...(this.store.streamId() ? { stream_id: this.store.streamId() } : {}),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : {}),
        ...(this.getUserId() ? { user_id: this.getUserId() } : {}),
      })

      return from(
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          signal: abortSignal,
        })
      ).pipe(
        switchMap(response => {
          if (!response.ok || !response.body) {
            return throwError(() => new Error('Streaming request failed'))
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder('utf-8')

          return from(reader.read()).pipe(
            expand(() => from(reader.read())),
            takeWhile(({ done }) => !done, true),
            map(({ value }) => (value ? decoder.decode(value, { stream: true }) : '')),
            filter(decoded => !!decoded),
            map(chunk => this.parseLines(chunk)),
            switchMap(lines => from(lines)),
            delay(30),
            tap(line => {
              try {
                const eventData = JSON.parse(line)

                if (eventData.event === 'chunks' && typeof eventData.data === 'string') {
                  this.inProgressAssisstantMessage += eventData.data
                }

                if (eventData.event === 'complete' && eventData.data) {
                  this.messageInProgress.set(false)
                  const { items } = eventData.data
                  const citations = items.at(1)?.result
                  const fullMsg = items.at(-1)?.text
                  //create new message for assisstant
                  this.inProgressAssisstantMessage = ''
                  const assistantMessage = new Message('', 'assistant')
                  this.updateMessages(assistantMessage)
                  assistantMessage.content = fullMsg
                  assistantMessage.context = { citations, intent: [] }
                  const formatted = this.formatMessage(assistantMessage)
                  this.replaceLastAssistantMessage(formatted)
                }
              } catch (err) {
                console.warn(`Failed to parse line:${err}`, line)
              }
            }),
            map(line => {
              try {
                const parsed = JSON.parse(line)
                return (parsed?.data as string) || ''
              } catch {
                return ''
              }
            }),
            filter((chunk): chunk is string => !!chunk),
            catchError(err => {
              this.updateMessages(new Message(`❌ ${err.message}`, 'error'))

              return throwError(() => err)
            }),
            tap({
              complete: () => {
                controller.abort()
                this.controller = null
              },
              error: () => {
                controller.abort()
                this.controller = null
              },
            })
          )
        })
      )
    })
  }

  /**
   * Parses lines from chunked event stream.
   */
  private parseLines(chunk: string): string[] {
    return chunk
      .split('\n')
      .filter(line => line.startsWith('data: '))
      .map(line => line.slice(6))
  }

  /**
   * Format content string via helper utilities.
   */
  private formatMessage(msg: Message): Message {
    msg.content = formatString(formatText(msg.content, msg))
    return new Message().clone(msg)
  }

  /**
   * Updates the latest assistant message's content progressively.
   */
  private updateLastAssistantMessage(newChunk: string): void {
    this.messages.update(messages => {
      const updated = [...messages]
      const index = updated.findLastIndex(m => m.isAssistant())

      if (index !== -1) {
        const previous = updated[index]
        const updatedMessage = previous.clone<Message>()
        updatedMessage.content += newChunk
        updated[index] = updatedMessage
      }

      return updated
    })
  }

  /**
   * Finalizes the assistant message with full content and context.
   */
  private replaceLastAssistantMessage(finalMessage: Message): void {
    this.messages.update(messages => {
      const newMessages = [...messages]
      const index = newMessages.findLastIndex(m => m.isAssistant())
      if (index !== -1) {
        const copy = finalMessage.clone<Message>() // كائن جديد بنفس الـ id
        newMessages[index] = copy
      } else {
        newMessages.push(finalMessage)
      }
      return [...newMessages]
    })
  }
  /**
   * Adds a message to the conversation.
   */
  private updateMessages(message: Message): void {
    this.messages.update(msgs => [...msgs, message])
  }
}
