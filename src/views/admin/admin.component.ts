import { NavCardComponent } from '@/components/nav-card/nav-card.component'
import { LocalService } from '@/services/local.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { MenuItem } from '@/contracts/menu-item-contract'
import { ADMIN_MENU_ITEMS } from '../../resources/admin-menu-items'
import { HasFeaturePermissionDirective } from '@/directives/has-feature-permission.directive'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavCardComponent, HasFeaturePermissionDirective],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export default class AdminComponent {
  lang = inject(LocalService)

  pages: MenuItem[] = ADMIN_MENU_ITEMS

  getIndices() {
    const _indices: number[] = []
    for (let i = 0; i <= this.pages.length; i++) {
      if (i % 2 === 0) _indices.push(i)
    }
    return _indices
  }

  isVertical(idx: number) {
    return !((idx - 2) % 8 < 4 && (idx - 2) % 8 >= 0)
    // return (idx - 2) % 8 < 4 && (idx - 2) % 8 >= 0 ? false : true
  }
}
