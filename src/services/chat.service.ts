import { Injectable, signal, WritableSignal } from '@angular/core'
import { Message } from '@/models/message'
import { BaseChatService } from './base-chat.service'
import { StreamComponent } from '@/enums/stream-component'

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseChatService {
  override streamResponse: WritableSignal<boolean> = signal(false)
  override messages: WritableSignal<Message[]> = signal([])
  override status: WritableSignal<boolean> = signal(false)
  override conversationId: WritableSignal<string> = signal('')
  override componentName = signal(StreamComponent.ChatbotComponent)

  getFilteredMessages(chatType?: string) {
    const _type = chatType ?? this.chatType
    return this.messages().filter(m => (_type ? _type === m.chatType : true))
  }
}
