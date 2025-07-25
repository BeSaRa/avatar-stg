import { MenuItem } from '@/contracts/menu-item-contract'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { ignoreQueryAndFragmentChange } from '@/utils/utils'
import { Component, computed, effect, inject, input, signal } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router'
import { filter, takeUntil, tap } from 'rxjs'

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent extends OnDestroyMixin(class {}) {
  private _router = inject(Router)
  lang = inject(LocalService)
  route = inject(ActivatedRoute)

  menu = input.required<MenuItem[]>()

  private _routesMenuMap: Record<string, MenuItem> = {}

  private readonly url = signal('')

  readonly pathRoutes = computed(() => {
    return this.url()
      .split('/')
      .map(part => this._routesMenuMap[part])
      .filter(Boolean)
  })

  constructor() {
    super()
    this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        ignoreQueryAndFragmentChange({ emit: 'path' }),
        tap(path => this.url.set(path)),
        takeUntil(this.destroy$)
      )
      .subscribe()

    effect(() => {
      if (this.menu().length) {
        this._routesMenuMap = this.buildRouteMapFromMenu(this.menu())
        console.log(this._routesMenuMap)
      }
    })
  }

  buildRouteMapFromMenu(menuItems: MenuItem[]): Record<string, MenuItem> {
    const routeMap: Record<string, MenuItem> = {}

    for (const item of menuItems) {
      const routeKey = item.fragment ? `${item.route.split('/').pop()!}${item.fragment}` : item.route.split('/').pop()!
      routeMap[routeKey] = item

      if (item.children?.length) {
        const childMap = this.buildRouteMapFromMenu(item.children)
        Object.assign(routeMap, childMap)
      }
    }

    return routeMap
  }
}
