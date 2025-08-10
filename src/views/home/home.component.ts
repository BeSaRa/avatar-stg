import { takeUntil, tap } from 'rxjs'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { Component, ElementRef, inject, viewChild } from '@angular/core'
import { ActivatedRoute, RouterOutlet } from '@angular/router'
import { LegalChatComponent } from '@/components/legal-chat/legal-chat.component'
import { SmartChatComponent } from '@/components/smart-chat/smart-chat.component'
import { AvatarService } from '@/services/avatar.service'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LegalChatService } from '@/services/legal-chat.service'
import { ChatService } from '@/services/chat.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, LegalChatComponent, SmartChatComponent],
  providers: [AvatarService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: {
    '[class.flex]': 'true',
    '[class.w-full]': 'true',
    '[class.h-full]': 'true',
  },
})
export default class HomeComponent extends OnDestroyMixin(class {}) {
  store = inject(AppStore)
  lang = inject(LocalService)
  main = viewChild.required<ElementRef<HTMLDivElement>>('main')
  route = inject(ActivatedRoute)
  legalService = inject(LegalChatService)
  chatService = inject(ChatService)

  /**
   *
   */
  constructor() {
    super()
    this.route.fragment
      .pipe(
        takeUntil(this.destroy$),
        tap(f => this.legalService.status.set(f === 'legal'))
        // tap(f => this.chatService.status.set(f === 'chat'))
      )
      .subscribe()
  }
}
