import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { Component, ElementRef, inject, viewChild } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LegalChatComponent } from '@/components/legal-chat/legal-chat.component'
import { SmartChatComponent } from '@/components/smart-chat/smart-chat.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, LegalChatComponent, SmartChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: {
    '[class.flex]': 'true',
    '[class.w-full]': 'true',
    '[class.h-full]': 'true',
  },
})
export default class HomeComponent {
  store = inject(AppStore)
  lang = inject(LocalService)
  main = viewChild.required<ElementRef<HTMLDivElement>>('main')
}
