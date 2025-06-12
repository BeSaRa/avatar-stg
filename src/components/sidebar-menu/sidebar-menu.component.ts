import { SVG_ICONS } from '@/constants/svg-icons'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { ChatService } from '@/services/chat.service'
import { LocalService } from '@/services/local.service'
import { MenuService } from '@/services/menu.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatTooltip } from '@angular/material/tooltip'
import { Router, RouterModule } from '@angular/router'
import { SettingsPopupComponent } from '../settings-popup/settings-popup.component'
import { LegalChatService } from '@/services/legal-chat.service'
import { AuthService } from '@/services/auth.service'
import { EmployeeService } from '@/services/employee.service'

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
  legalService = inject(LegalChatService)
  employeeService = inject(EmployeeService)
  dialog = inject(MatDialog)
  menuService = inject(MenuService)
  auth = inject(AuthService)

  readonly svgIcons = SVG_ICONS

  isOpened = false
  private router = inject(Router)

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

  showSmartBot() {
    this.legalService.status.set(false)
    this.chatService.status.update(value => !value)
  }

  showLegalChatBot() {
    this.chatService.status.set(false)
    this.legalService.status.update(value => !value)
  }

  openSettings() {
    this.dialog.open(SettingsPopupComponent)
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('auth/login').then()
    })
  }
}
