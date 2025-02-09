import { HttpInterceptorFn } from '@angular/common/http'
import { ConfigService } from '@/services/config.service'
import { inject } from '@angular/core'

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService)

  const environmentKunaKeys: Record<string, string> = {
    AQARAT_DEV: configService.CONFIG.KUNA_DEV,
    AQARAT_STG: configService.CONFIG.KUNA_STG,
    AQARAT_PROD: configService.CONFIG.KUNA_PROD,
  }

  // Get the KUNA key based on the current environment
  const currentEnvironment = configService.CONFIG.BASE_ENVIRONMENT
  const apiKey = environmentKunaKeys[currentEnvironment]

  return next(
    req.clone({
      setHeaders: apiKey ? { 'x-functions-key': apiKey } : {},
    })
  )
}
