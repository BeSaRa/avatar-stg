import { HttpInterceptorFn } from '@angular/common/http'
import { ConfigService } from '@/services/config.service'
import { inject } from '@angular/core'
import { finalize } from 'rxjs'
import { MessageService } from '@/services/message.service'
import { SHOW_SNACKBAR } from '@/http-contexts/show-snackbar'

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(ConfigService)
  const messageService = inject(MessageService)

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
  ).pipe(
    finalize(() => {
      if (req.context.has(SHOW_SNACKBAR)) {
        messageService.showInfo('Done successfully !')
      }
    })
  )
}
