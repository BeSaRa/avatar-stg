import { SettingsPopupComponent } from '@/components/settings-popup/settings-popup.component'
import { SVG_ICONS } from '@/constants/svg-icons'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { AppStore } from '@/stores/app.store'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RouterLink } from '@angular/router'
import { getState } from '@ngrx/signals'
import { ALL_PERMISSIONS } from '../../resources/all-permissions'
import { MENU_ITEMS } from '../../resources/menu-items'
import { ButtonDirective } from '@/directives/button.directive'
import { EmployeeService } from '@/services/employee.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[class.w-full]': 'true',
  },
  animations: [
    trigger('menu', [
      state(
        'opened',
        style({
          height: '*',
        })
      ),
      state(
        'closed',
        style({
          height: '0',
        })
      ),
      transition('opened <=> closed', animate('250ms ease-in-out')),
    ]),
  ],
})
export class HeaderComponent {
  chatService = inject(ChatService)
  store = inject(AppStore)
  lang = inject(LocalService)
  settings = getState(this.store)
  dialog = inject(MatDialog)
  clonedSettings = structuredClone(this.settings)
  menuStatus: 'opened' | 'closed' = 'closed'
  menuItems = MENU_ITEMS
  SvgIcons = SVG_ICONS
  employeeService = inject(EmployeeService)
  private menuStatusMap = {
    opened: 'closed',
    closed: 'opened',
  }

  toggleMenu() {
    this.menuStatus = this.menuStatusMap[this.menuStatus as keyof typeof this.menuStatusMap] as 'opened' | 'closed'
  }

  openSettings($event: Event) {
    $event.preventDefault()
    this.dialog.open(SettingsPopupComponent)
  }

  openChatbot($event: Event) {
    $event.preventDefault()
    this.toggleChatStatusIfNeeded()
    // this.chatService.showLegal.set(false)
  }

  showLegalChatBot($event: Event) {
    $event.preventDefault()
    // this.chatService.showLegal.update(value => !value)
    this.toggleChatStatusIfNeeded()
  }

  private toggleChatStatusIfNeeded() {
    // const isActive = this.chatService.status()
    // const isLegalVisible = this.chatService.showLegal()
    // if (!isActive || (isActive && !isLegalVisible)) {
    //   this.chatService.status.update(value => !value)
    // }
  }

  hasPermission(permissions: (keyof typeof ALL_PERMISSIONS)[]) {
    if (!this.employeeService.hasAuthenticatedUser()) return false
    return this.employeeService.hasAnyPermission(permissions)
  }
}
