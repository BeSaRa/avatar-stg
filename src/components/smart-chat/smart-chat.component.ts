import { BaseChatService } from '@/services/base-chat.service'
import { ChatService } from '@/services/chat.service'
import { Component, inject } from '@angular/core'
import { ChatContainerComponent } from '../chat-container/chat-container.component'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-smart-chat',
  standalone: true,
  providers: [{ provide: BaseChatService, useExisting: ChatService }],
  imports: [ChatContainerComponent],
  template: `<app-chat-container
    [botNameOptions]="{ showBotSelection: true }"
    [title]="lang.locals.chat_assisstant"
    [greeting_message]="lang.locals.greeting_chat_message"
    [showUploadDocumentBtn]="false"
    class="fixed z-20 rtl:right-16 ltr:left-16 bottom-0" />`,
})
export class SmartChatComponent {
  lang = inject(LocalService)
}
