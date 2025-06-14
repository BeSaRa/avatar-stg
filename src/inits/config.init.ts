import { APP_INITIALIZER, Provider } from '@angular/core'
import { ConfigService } from '@/services/config.service'
import { UrlService } from '@/services/url.service'
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs'
import { SpeechService } from '@/services/speech.service'
import { LocalService } from '@/services/local.service'
import { AuthService } from '@/services/auth.service'
import { TokenService } from '@/services/token.service'

export default {
  provide: APP_INITIALIZER,
  useFactory: (
    configService: ConfigService,
    urlService: UrlService,
    commonService: SpeechService,
    local: LocalService,
    auth: AuthService,
    tokenService: TokenService
  ) => {
    return () =>
      forkJoin([configService.load()]).pipe(
        tap(() => urlService.setConfigService(configService)),
        tap(() => urlService.prepareUrls()),
        switchMap(() => local.load()),
        switchMap(() =>
          tokenService.hasRefreshToken() ? auth.refreshToken().pipe(catchError(() => of(null))) : of(null)
        )
        // tap(() => injector.get(ApplicationUserService).checkAutoLogoutOnRefresh())
      )
  },
  deps: [ConfigService, UrlService, SpeechService, LocalService, AuthService, TokenService],
  multi: true,
} satisfies Provider
