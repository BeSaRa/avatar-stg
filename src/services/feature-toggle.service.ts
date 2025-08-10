import { FEATURE_KEYS, FeatureKey } from './../constants/feature-keys'
import { computed, inject, Injectable, signal } from '@angular/core'
import { ConfigService } from './config.service'
import { FEATURE_PROFILE_MAP } from '@/constants/feature-profile-map'

@Injectable({
  providedIn: 'root',
})
export class FeatureToggleService {
  private readonly config = inject(ConfigService)
  private readonly features = FEATURE_PROFILE_MAP

  private readonly currentProfile = signal<Record<FeatureKey, boolean> | undefined>(undefined)

  private get profile(): Record<FeatureKey, boolean> {
    return this.currentProfile() ?? this.features['aqarat']
  }

  loadProfileFeatures() {
    const profile = this.config.CONFIG.FEATURE_PROFILE
    this.currentProfile.set(this.features[profile])
  }
  readonly isAuthEnabled = computed(() => this.profile[FEATURE_KEYS.AUTH])

  isFeatureEnabled(feature: FeatureKey): boolean {
    return !!this.profile[feature]
  }

  getAll(): Record<FeatureKey, boolean> {
    return this.profile
  }
}
