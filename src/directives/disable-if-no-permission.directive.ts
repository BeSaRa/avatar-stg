import { Directive, effect, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core'
import { ALL_PERMISSIONS } from '../resources/all-permissions'
import { EmployeeService } from '@/services/employee.service'

@Directive({
  selector: '[appDisableIfNoPermission]',
  standalone: true,
})
export class DisableIfNoPermissionDirective {
  private readonly employeeService = inject(EmployeeService)
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)

  appDisableIfNoPermission = input.required<(keyof typeof ALL_PERMISSIONS)[]>()

  private hasPermission = true

  showEffect = effect(() => {
    this.hasPermission = this.employeeService.hasAllPermission(this.appDisableIfNoPermission()!)
    this.renderer.setProperty(this.el.nativeElement, 'disabled', !this.hasPermission)
    this.renderer.setAttribute(this.el.nativeElement, 'aria-disabled', String(!this.hasPermission))
    this.renderer.setStyle(this.el.nativeElement, 'pointer-events', this.hasPermission ? 'auto' : 'none')
    this.renderer.setStyle(this.el.nativeElement, 'opacity', this.hasPermission ? '1' : '0.5')
  })

  private preventIfUnauthorized(event: Event): void {
    if (!this.hasPermission) {
      event.stopImmediatePropagation()
      event.preventDefault()
    }
  }

  @HostListener('click', ['$event'])
  @HostListener('mousedown', ['$event'])
  @HostListener('dblclick', ['$event'])
  onMouseEvents(event: Event) {
    this.preventIfUnauthorized(event)
  }

  @HostListener('keydown', ['$event'])
  @HostListener('keyup', ['$event'])
  @HostListener('keypress', ['$event'])
  onKeyboardEvents(event: KeyboardEvent) {
    this.preventIfUnauthorized(event)
  }
}
