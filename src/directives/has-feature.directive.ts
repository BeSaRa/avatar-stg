import { FeatureKey } from '@/constants/feature-keys'
import { FeatureToggleService } from '@/services/feature-toggle.service'
import { NgIf } from '@angular/common'
import { Directive, effect, inject, input } from '@angular/core'

@Directive({
  selector: '[appHasFeature]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class HasFeatureDirective {
  private readonly featureToggle = inject(FeatureToggleService)
  private ngIf = inject(NgIf, { host: true })

  appHasFeature = input.required<FeatureKey>()
  showEffect = effect(
    () => {
      this.ngIf.ngIf = this.featureToggle.isFeatureEnabled(this.appHasFeature())
    },
    { allowSignalWrites: true }
  )
}
