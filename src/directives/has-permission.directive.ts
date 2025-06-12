import { NgIf } from '@angular/common'
import { Directive, effect, inject, input } from '@angular/core'
import { ALL_PERMISSIONS } from '../resources/all-permissions'
import { EmployeeService } from '@/services/employee.service'

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class HasPermissionDirective {
  private readonly employeeService = inject(EmployeeService)
  private ngIf = inject(NgIf, { host: true })

  appHasPermission = input.required<(keyof typeof ALL_PERMISSIONS)[]>()
  showEffect = effect(
    () => {
      this.ngIf.ngIf = this.employeeService.hasAllPermission(this.appHasPermission()!)
    },
    { allowSignalWrites: true }
  )
}
