import { Directive, effect, inject, input } from '@angular/core'
import { FeatureKey } from '@/constants/feature-keys'
import { ALL_PERMISSIONS } from '../resources/all-permissions'
import { EmployeeService } from '@/services/employee.service'
import { FeatureToggleService } from '@/services/feature-toggle.service'
import { NgIf } from '@angular/common'

@Directive({
  selector: '[appHasFeaturePermission]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class HasFeaturePermissionDirective {
  private readonly ngIf = inject(NgIf, { host: true })
  private readonly featureToggle = inject(FeatureToggleService)
  private readonly employeeService = inject(EmployeeService)

  readonly appHasFeaturePermission = input.required<{
    feature?: FeatureKey
    permissions?: (keyof typeof ALL_PERMISSIONS)[]
  }>()

  readonly updateEffect = effect(
    () => {
      const { feature, permissions } = this.appHasFeaturePermission()

      const isAuthEnabled = this.featureToggle.isAuthEnabled()
      const isFeatureEnabled = !feature || this.featureToggle.isFeatureEnabled(feature)

      const hasRequiredPermissions =
        !isAuthEnabled || !permissions?.length || this.employeeService.hasAllPermission(permissions)

      this.ngIf.ngIf = isFeatureEnabled && hasRequiredPermissions
    },
    { allowSignalWrites: true }
  )
}
