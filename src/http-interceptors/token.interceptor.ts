import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { CONFIGURATIONS } from '../resources/configurations'
import { NO_ACCESS_TOKEN } from '@/http-contexts/no-access-token'
import { TokenService } from '@/services/token.service'

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService)

  let _req = req
  if (!req.context.get(NO_ACCESS_TOKEN))
    _req = req.clone({
      setHeaders: {
        ...(tokenService.hasAccessToken()
          ? {
              [CONFIGURATIONS.TOKEN_HEADER_KEY]: `Bearer ${tokenService.getAccessToken()}`,
            }
          : undefined),
      },
    })

  return next(_req)
}
