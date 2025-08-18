import { FeatureProfile } from '@/types/feature-profile'
import { FeatureKey } from './feature-keys'
import { RAYYAN_FEATURES } from '../resources/features.config.rayyan'
import { AQARAT_FEATURES } from '../resources/features.config.aqarat'
import { PHCC_FEATURES } from '../resources/features.config.phcc'
import { DEMO_FEATURES } from '../resources/features.config.demo'

export const FEATURE_PROFILE_MAP: Record<FeatureProfile, Record<FeatureKey, boolean>> = {
  demo: DEMO_FEATURES,
  rayyan: RAYYAN_FEATURES,
  aqarat: AQARAT_FEATURES,
  phcc: PHCC_FEATURES,
}
