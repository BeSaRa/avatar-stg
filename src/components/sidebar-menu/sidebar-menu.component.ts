import { SVG_ICONS } from '@/constants/svg-icons'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { MenuService } from '@/services/menu.service'
import { ApplicationUserService } from '@/views/auth/services/application-user.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTooltip } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'
import { SettingsPopupComponent } from '../settings-popup/settings-popup.component'

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, SanitizerPipe, MatTooltip],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  lang = inject(LocalService)
  chatService = inject(ChatService)
  applicationUserService = inject(ApplicationUserService)
  dialog = inject(MatDialog)
  menuService = inject(MenuService)

  readonly svgIcons = SVG_ICONS

  isOpened = false

  get shownItems() {
    return this.menuService.getMenuItems().slice(0, 7)
  }

  get hiddenItems() {
    return this.menuService.getMenuItems().slice(7)
  }

  toggleFullMenu() {
    this.isOpened = !this.isOpened
  }

  getArrowIcon() {
    return this.lang.isLtr()
      ? this.isOpened
        ? this.svgIcons.ARROW_LEFT
        : this.svgIcons.ARROW_RIGHT
      : this.isOpened
        ? this.svgIcons.ARROW_RIGHT
        : this.svgIcons.ARROW_LEFT
  }

  openChatbot() {
    this.toggleChatStatusIfNeeded()
    this.chatService.showLegal.set(false)
  }

  showLegalChatBot() {
    this.chatService.showLegal.update(value => !value)
    this.toggleChatStatusIfNeeded()
  }

  private toggleChatStatusIfNeeded() {
    const isActive = this.chatService.status()
    const isLegalVisible = this.chatService.showLegal()

    if (!isActive || (isActive && !isLegalVisible)) {
      this.chatService.status.update(value => !value)
    }
  }

  openSettings() {
    this.dialog.open(SettingsPopupComponent)
  }

  logout() {
    this.applicationUserService.logout()
  }
}
