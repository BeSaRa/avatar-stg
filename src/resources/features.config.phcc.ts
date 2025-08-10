import { FEATURE_KEYS } from '@/constants/feature-keys'
import { RAYYAN_FEATURES } from './features.config.rayyan'

export const PHCC_FEATURES = {
  ...RAYYAN_FEATURES,
  [FEATURE_KEYS.ADMIN_PAGES]: false,
  [FEATURE_KEYS.ADMIN_INSIGHTS]: false,
  [FEATURE_KEYS.AVATAR]: false,
}
