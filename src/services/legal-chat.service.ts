import { Injectable, signal, WritableSignal } from '@angular/core'
import { BaseChatService } from './base-chat.service'
import { Message } from '@/models/message'

@Injectable({
  providedIn: 'root',
})
export class LegalChatService extends BaseChatService {
  override messages: WritableSignal<Message[]> = signal([])
  override status: WritableSignal<boolean> = signal(false)
  override conversationId: WritableSignal<string> = signal('')
}
