import { HttpInterceptorFn } from '@angular/common/http'
import { ConfigService } from '@/services/config.service'
import { inject } from '@angular/core'

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService)
  const config = configService.CONFIG
  const headers: Record<string, string> = {}
  const { BASE_ENVIRONMENT: currentEnvironment, IS_OCP, KUNA_KEYS, OCP_APIM_KEYS } = config

  if (IS_OCP) {
    const ocpKey = OCP_APIM_KEYS[currentEnvironment]
    if (ocpKey) {
      headers['Ocp-Apim-Subscription-Key'] = ocpKey
    }
  } else {
    const functionsKey = KUNA_KEYS[currentEnvironment]
    if (functionsKey) {
      headers['x-functions-key'] = functionsKey
    }
  }

  const clonedRequest = req.clone({
    setHeaders: headers,
  })

  return next(clonedRequest)
}
