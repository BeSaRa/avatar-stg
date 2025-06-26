import { ChatMessageResultContract } from '@/contracts/chat-message-result-contract'
import { Message } from '@/models/message'
import { AppStore } from '@/stores/app.store'
import { formatString, formatText } from '@/utils/utils'
import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable, signal, WritableSignal } from '@angular/core'
import {
  catchError,
  defer,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  filter,
  forkJoin,
  from,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs'
import { UrlService } from './url.service'
import { AdminService } from './admin.service'
import { FormControl } from '@angular/forms'
import { MediaResultContract } from '@/contracts/media-result-contract'
import { STORAGE_ITEMS } from '@/constants/storage-items'
import { ICitations } from '@/models/base-message'
import { TokenService } from '@/services/token.service'
import { LoginDataContract } from '@/contracts/login-data-contract'
import { MarkdownService } from 'ngx-markdown'
import { StreamComponent } from '@/enums/stream-component'

@Injectable({
  providedIn: 'root',
})
export abstract class BaseChatService {
  protected readonly http = inject(HttpClient)
  protected readonly urlService = inject(UrlService)
  private readonly adminService = inject(AdminService)
  protected readonly markdownService = inject(MarkdownService)
  protected readonly store = inject(AppStore)
  protected readonly tokenService = inject(TokenService)
  readonly botNameCtrl = new FormControl('', { nonNullable: true })
  abstract messages: WritableSignal<Message[]>
  abstract status: WritableSignal<boolean>
  abstract streamResponse: WritableSignal<boolean>
  abstract conversationId: WritableSignal<string>
  abstract componentName: WritableSignal<StreamComponent>
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
        ...(this.store.streamIdMap()[this.componentName()]
          ? { stream_id: this.store.streamIdMap()[this.componentName()] }
          : null),
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
      userId = (JSON.parse(userItem) as LoginDataContract).user_id
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
        ...(this.store.streamIdMap()[this.componentName()]
          ? { stream_id: this.store.streamIdMap()[this.componentName()] }
          : {}),
        ...(this.conversationId() ? { conversation_id: this.conversationId() } : {}),
        ...(this.getUserId() ? { user_id: this.getUserId() } : {}),
      })

      const token = this.tokenService.getAccessToken()
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
      .map(line => line.slice(6)) // نزيل "data: "
  }

  /**
   * Format content string via helper utilities.
   */
  private async formatMessage(msg: Message): Promise<Message> {
    msg.content = await this.markdownService.parse(msg.content)
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
        const copy = finalMessage.clone<Message>()
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

  // private async processStream(stream: ReadableStream<Uint8Array>): Promise<boolean> {
  //   const reader = stream.getReader()
  //   const decoder = new TextDecoder('utf-8')
  //   let fullText = ''
  //   let jsonBuffer = ''
  //   let chunkBuffer = ''

  //   try {
  //     while (true) {
  //       const { done, value } = await reader.read()
  //       if (done) break
  //       debugger

  //       // ندمج النص بعد فك التشفير الجزئي
  //       fullText += decoder.decode(value, { stream: true })

  //       // نحلل الأسطر المنتهية فقط
  //       const lines = fullText.split('\n')
  //       fullText = lines.pop() || '' // نحتفظ بأي سطر ناقص

  //       for (const line of lines) {
  //         if (!line.startsWith('data: ')) continue

  //         jsonBuffer += line.slice(6)

  //         let parsed: { event: string; data: unknown } | null = null
  //         try {
  //           parsed = JSON.parse(jsonBuffer)
  //           jsonBuffer = ''
  //         } catch {
  //           continue
  //         }

  //         if (parsed!.event !== 'chunks') {
  //           this.messageInProgress.set(false)

  //           const data = parsed!.data as {
  //             action_results: unknown[]
  //             citations: ICitations[]
  //             content: string
  //             conversation_id: string
  //             user_id: string
  //             stream_id: string | null
  //           }

  //           const assistantMessage = new Message('', 'assistant')
  //           assistantMessage.content = data.content
  //           assistantMessage.context = { citations: data.citations, intent: [] }

  //           this.conversationId.set(data.conversation_id)
  //           this.inProgressMessage.next('')
  //           this.updateMessages(assistantMessage)

  //           const formatted = this.formatMessage(assistantMessage)
  //           this.replaceLastAssistantMessage(formatted)
  //           break
  //         }

  //         await new Promise(res => setTimeout(res, 40))

  //         await this.typeChunk(parsed!.data as string, char => (chunkBuffer += char))
  //       }
  //     }

  //     // flush the decoder (very important!)
  //     fullText += decoder.decode()

  //     reader.releaseLock()
  //   } catch (error) {
  //     reader.releaseLock()
  //     console.error('❌ Stream error:', error)
  //   }

  //   return true
  // }

  private async processStream(stream: ReadableStream<Uint8Array>): Promise<boolean> {
    const reader = stream.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullText = ''
    let jsonBuffer = ''
    let chunkBuffer = ''

    try {
      while (true) {
        const done = await this.readStreamChunk(reader, decoder, val => (fullText += val))
        if (done) break

        const lines = this.extractValidLines(fullText)
        fullText = lines.remaining

        for (const line of lines.valid) {
          const parsed = this.tryParseJSONLine(line, jsonBuffer)
          if (!parsed) continue

          jsonBuffer = ''

          const isDone = await this.handleParsedEvent(parsed, value => (chunkBuffer += value))
          if (isDone) break
        }
      }

      fullText += decoder.decode()
      reader.releaseLock()
    } catch (error) {
      reader.releaseLock()
      console.error('❌ Stream error:', error)
    }

    return true
  }

  private async readStreamChunk(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder,
    onChunk: (chunk: string) => void
  ): Promise<boolean> {
    const { done, value } = await reader.read()
    if (done) return true
    onChunk(decoder.decode(value, { stream: true }))
    return false
  }

  private extractValidLines(text: string): { valid: string[]; remaining: string } {
    const lines = text.split('\n')
    const remaining = lines.pop() || ''
    return { valid: lines.filter(l => l.startsWith('data: ')), remaining }
  }
  private tryParseJSONLine(line: string, jsonBuffer: string): { event: string; data: unknown } | null {
    jsonBuffer += line.slice(6)
    try {
      return JSON.parse(jsonBuffer)
    } catch {
      return null
    }
  }
  private async handleParsedEvent(
    parsed: { event: string; data: unknown },
    chunkBufferCallback: (c: string) => string
  ): Promise<boolean> {
    if (parsed.event !== 'chunks') {
      this.messageInProgress.set(false)

      const data = parsed.data as {
        action_results: unknown[]
        citations: ICitations[]
        content: string
        conversation_id: string
        user_id: string
        stream_id: string | null
      }

      const assistantMessage = new Message('', 'assistant')
      assistantMessage.content = data.content
      assistantMessage.context = { citations: data.citations, intent: [] }

      this.conversationId.set(data.conversation_id)
      this.inProgressMessage.next('')
      this.updateMessages(assistantMessage)

      const formatted = await this.formatMessage(assistantMessage)
      this.replaceLastAssistantMessage(formatted)

      return true
    }

    await new Promise(res => setTimeout(res, 10))
    await this.typeChunk(parsed.data as string, chunkBufferCallback)
    return false
  }
}
