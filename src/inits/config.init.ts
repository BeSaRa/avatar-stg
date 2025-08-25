import { AppStore } from '@/stores/app.store'
import { AuthService } from '@/services/auth.service'
import { ConfigService } from '@/services/config.service'
import { FeatureToggleService } from '@/services/feature-toggle.service'
import { LocalService } from '@/services/local.service'
import { SpeechService } from '@/services/speech.service'
import { TokenService } from '@/services/token.service'
import { UrlService } from '@/services/url.service'
import { APP_INITIALIZER, Injector, Provider } from '@angular/core'
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs'

export default {
  provide: APP_INITIALIZER,
  useFactory: (
    configService: ConfigService,
    urlService: UrlService,
    commonService: SpeechService,
    local: LocalService,
    auth: AuthService,
    tokenService: TokenService,
    featureToggle: FeatureToggleService,
    injector: Injector
  ) => {
    return () =>
      forkJoin([configService.load()]).pipe(
        tap(() => {
          urlService.setConfigService(configService)
          featureToggle.loadProfileFeatures()
        }),
        tap(() => urlService.prepareUrls()),
        switchMap(() => local.load()),
        switchMap(() => {
          if (!featureToggle.isAuthEnabled()) {
            return commonService.generateSpeechToken().pipe(
              tap(response => injector.get(AppStore).updateSpeechToken(response)),
              catchError(error => {
                console.error('Error generating speech token:', error)
                // Optionally log the error or set a fallback state
                return of(null) // Return a fallback observable
              })
            )
          }

          return tokenService.hasRefreshToken() ? auth.refreshToken().pipe(catchError(() => of(null))) : of(null)
        })
      )
  },
  deps: [
    ConfigService,
    UrlService,
    SpeechService,
    LocalService,
    AuthService,
    TokenService,
    FeatureToggleService,
    Injector,
  ],
  multi: true,
} satisfies Provider
