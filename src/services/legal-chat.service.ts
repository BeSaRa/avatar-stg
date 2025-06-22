import { Injectable, signal, WritableSignal } from '@angular/core'
import { BaseChatService } from './base-chat.service'
import { Message } from '@/models/message'
import { StreamComponent } from '@/enums/stream-component'

@Injectable({
  providedIn: 'root',
})
export class LegalChatService extends BaseChatService {
  override componentName = signal(StreamComponent.LegalComponent)
  override messages: WritableSignal<Message[]> = signal([])
  override status: WritableSignal<boolean> = signal(false)
  override conversationId: WritableSignal<string> = signal('')
}
