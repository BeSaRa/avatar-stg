import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { Message } from '@/models/message'
import { AppStore } from '@/stores/app.store'
import { formatString, formatText } from '@/utils/utils'
import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable, signal, WritableSignal } from '@angular/core'
import {
  Observable,
  catchError,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  tap,
  exhaustMap,
  Subject,
  defer,
  EMPTY,
  from,
  switchMap,
  filter,
} from 'rxjs'
import { UrlService } from './url.service'
import { AdminService } from './admin.service'
import { FormControl } from '@angular/forms'
import { MediaResultContract } from '@/contracts/media-result-contract'
import { STORAGE_ITEMS } from '@/constants/storage-items'
import { ApplicationUser } from '@/views/auth/models/application-user'
import { ICitations } from '@/models/base-message'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'

@Injectable({
  providedIn: 'root',
})
export abstract class BaseChatService {
  protected readonly http = inject(HttpClient)
  protected readonly urlService = inject(UrlService)
  private readonly adminService = inject(AdminService)
  protected readonly store = inject(AppStore)
  protected readonly applicationUserService = inject(ApplicationUserService)
  readonly botNameCtrl = new FormControl('', { nonNullable: true })
  abstract messages: WritableSignal<Message[]>
  abstract status: WritableSignal<boolean>
  abstract conversationId: WritableSignal<string>
  chatType?: string
  messageInProgress = signal(false)
  private inProgressMessage = new Subject<string>()

  getInProgressMessage() {
    return this.inProgressMessage.asObservable()
  }

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
        }),
        map(res => {
          res.message.content = formatString(formatText(res.message.content, res.message))
          res.message = new Message().clone<Message>({ ...res.message, chatType: chatType ?? bot })
          this.conversationId.set(res.message.conversation_id)
          this.messages.update(messages => [...messages, res.message])
          return res
        })
      )
  }

  processFormattedText(formattedText: string) {
    const matches = [...formattedText.matchAll(/href="(.*?)"/g)]

    // Handle empty matches
    if (matches.length === 0) {
      console.log('No matches found in formatted text.')
      return of(formattedText) // Return the unmodified text as an Observable
    }

    const replacementObservables = matches.map(match => {
      const url = match[1]

      if (url.includes('blob.core.windows.net')) {
        // Fetch API result for URLs containing the sequence
        return this.adminService.secureUrl(url).pipe(
          map(apiResponse => {
            return {
              match: match[0],
              replacement: match[0].replace(url, apiResponse), // Replace the original encoded URL
            }
          }),
          catchError(() => {
            return of({
              match: match[0],
              replacement: match[0], // Keep the original if there's an error
            })
          })
        )
      }
      // If no API call is needed, return the original
      return of({
        match: match[0],
        replacement: match[0],
      })
    })

    return forkJoin(replacementObservables).pipe(
      map(replacements => {
        replacements.forEach(({ match, replacement }) => {
          formattedText = formattedText.replace(match, replacement)
        })
        return formattedText
      })
    )
  }

  onBotNameChange() {
    return this.botNameCtrl.valueChanges.pipe(
      filter(value => !!value && value.trim() !== ''),
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

  sendMessageStreamed(content: string, bot: string) {
    const userMessage = new Message(content, 'user')
    this.updateMessages(userMessage)
    this.inProgressMessage.next('')

    return defer(() => {
      this.messageInProgress.set(true)

      const url = `${this.urlService.URLS.AGENT_CHAT}/stream/${bot}`
      const body = JSON.stringify({
        messages: this.messages(),
        ...(this.store.streamId() ? { stream_id: this.store.streamId() } : {}),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : {}),
        ...(this.getUserId() ? { user_id: this.getUserId() } : {}),
      })

      const token = this.applicationUserService.$applicationUser().access_token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }

      const { IS_OCP, OCP_APIM_KEYS, BASE_ENVIRONMENT } = this.urlService.config.CONFIG
      const subscriptionKey = OCP_APIM_KEYS[BASE_ENVIRONMENT]
      if (IS_OCP) {
        headers['Ocp-Apim-Subscription-Key'] = subscriptionKey
      }
      return from(
        fetch(url, {
          method: 'POST',
          headers: headers,
          body,
        })
      ).pipe(
        switchMap(async response => {
          if (!response.ok || !response.body) {
            return EMPTY
          }
          return from(this.processStream(response.body)).pipe(map(() => ''))
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
      .filter(line => {
        try {
          JSON.parse(line)
          return true
        } catch {
          console.warn('❌ Ignored invalid JSON line:', line)
          return false
        }
      })
  }

  /**
   * Format content string via helper utilities.
   */
  private formatMessage(msg: Message): Message {
    msg.content = formatString(formatText(msg.content, msg))
    return new Message().clone(msg)
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

  private async typeChunk(text: string, bufferCallback: (val: string) => string): Promise<void> {
    for (const char of text) {
      await new Promise(resolve => setTimeout(resolve, 10)) // delayed for each char
      this.inProgressMessage.next(bufferCallback(char))
    }
  }

  private async processStream(stream: ReadableStream<Uint8Array>): Promise<boolean> {
    const reader = stream.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let jsonBuffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = this.parseLines(chunk)

        for (const line of lines) {
          jsonBuffer += line

          let parsed: { event: string; data: unknown } | null = null
          try {
            parsed = JSON.parse(jsonBuffer)
            jsonBuffer = ''
          } catch {
            continue
          }

          if (parsed?.event !== 'chunks') {
            this.messageInProgress.set(false)

            const { citations, content } = parsed!.data as { citations: ICitations[]; content: string }
            const fullMsg = content

            this.inProgressMessage.next('')
            const assistantMessage = new Message('', 'assistant')
            this.updateMessages(assistantMessage)

            assistantMessage.content = fullMsg
            assistantMessage.context = { citations, intent: [] }

            const formatted = this.formatMessage(assistantMessage)
            this.replaceLastAssistantMessage(formatted)
            break
          }

          await new Promise(resolve => setTimeout(resolve, 40))
          await this.typeChunk(parsed.data as string, value => (buffer += value))
        }
      }

      reader.releaseLock()
    } catch (error) {
      reader.releaseLock()
      console.log('❌ Error processing stream:', error)
    }

    return true
  }
}
