import { StreamComponent } from '@/enums/stream-component'
import { Component, inject } from '@angular/core'
import { ChatContainerComponent } from '../chat-container/chat-container.component'
import { BaseChatService } from '@/services/base-chat.service'
import { LegalChatService } from '@/services/legal-chat.service'
import { LocalService } from '@/services/local.service'

@Component({
  selector: 'app-legal-chat',
  standalone: true,
  providers: [{ provide: BaseChatService, useExisting: LegalChatService }],
  imports: [ChatContainerComponent],
  template: `<app-chat-container
    [botNameOptions]="{ showBotSelection: false, botName: 'legal' }"
    [title]="lang.locals.chat"
    [componentName]="streamComponent.LegalComponent"
    [greeting_message]="lang.locals.greeting_chat_message_legal"
    [showUploadDocumentBtn]="false"
    class="fixed z-20 rtl:right-16 ltr:left-16 bottom-0" />`,
})
export class LegalChatComponent {
  chatService = inject(BaseChatService)
  lang = inject(LocalService)
  readonly streamComponent = StreamComponent
}
