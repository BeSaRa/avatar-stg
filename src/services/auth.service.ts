import { inject, Injectable, signal } from '@angular/core'
import { UrlService } from '@/services/url.service'
import { HttpClient, HttpContext } from '@angular/common/http'
import { filter, iif, Observable, of, Subject, switchMap, tap, timer } from 'rxjs'
import { CastResponse } from 'cast-response'
import { LoginData } from '@/models/login-data'
import { TokenService } from '@/services/token.service'
import { EmployeeService } from '@/services/employee.service'
import { NO_ACCESS_TOKEN } from '@/http-contexts/no-access-token'
import { ConfigService } from '@/services/config.service'
import { IdleService } from '@/services/idle.service'
import { MessageService } from '@/services/message.service'
import { LocalService } from '@/services/local.service'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly tokenService = inject(TokenService)
  private readonly employeeService = inject(EmployeeService)
  private readonly configService = inject(ConfigService)
  private readonly startTimer$ = new Subject<void>()
  private readonly idleService = inject(IdleService)
  private readonly messageService = inject(MessageService)
  private readonly lang = inject(LocalService)
  private readonly router = inject(Router)

  userIdleState = signal(false)

  private readonly calculatedRefreshTime$ = this.startTimer$.pipe(
    switchMap(() => {
      return this.calculateWhenToRefreshTokenPip()
    })
  )

  constructor() {
    this.listenToRefreshTokenTimer()
    this.listenToIdleTimeout()
    this.idleService.onIdleStateChanged$.subscribe(value => {
      this.userIdleState.set(value)
    })
  }

  calculateWhenToRefreshTokenPip() {
    const tokenDuration =
      this.configService.CONFIG.ACCESS_TOKEN_TTL_IN_MINUTES -
      this.configService.CONFIG.REFRESH_ACCESS_TOKEN_BEFORE_ENDING_IN_MINUTES

    return timer(tokenDuration * 60000)
      .pipe(
        switchMap(() =>
          iif(() => this.userIdleState() && this.employeeService.hasAuthenticatedUser(), of(true), of(false))
        )
      )
      .pipe(filter(v => !v)) // only if user not Idle make refresh Token
      .pipe(switchMap(() => this.refreshToken()))
  }

  listenToRefreshTokenTimer() {
    this.calculatedRefreshTime$.subscribe(value => console.log('value', value))
  }

  @CastResponse(() => LoginData)
  private _login(credentials: { username: string; password: string }): Observable<LoginData> {
    return this.http.post<LoginData>(`${this.urlService.URLS.USER}/login`, credentials)
  }

  private prepareLoggedInUserPipe() {
    return tap((data: LoginData) => {
      this.idleService.stopWatching()
      data.preparePermissions()
      this.tokenService.setTokens(data.refresh_token, data.access_token)
      this.employeeService.setCurrentUser(data)
      this.startCalculateTimeout()
      this.idleService.startWatching()
    })
  }

  login(credentials: { username: string; password: string }): Observable<LoginData> {
    return this._login(credentials).pipe(this.prepareLoggedInUserPipe())
  }

  logout() {
    return new Observable<LoginData | null>(subscriber => {
      subscriber.next(this.employeeService.getCurrentUser())
      subscriber.complete()
      this.employeeService.removeCurrentUser()
      this.tokenService.removeTokens()
    })
  }

  @CastResponse(() => LoginData)
  private _refreshToken(): Observable<LoginData> {
    return this.http.get<LoginData>(`${this.urlService.URLS.USER}/access-token`, {
      context: new HttpContext().set(NO_ACCESS_TOKEN, true),
      headers: {
        Authorization: `Bearer ${this.tokenService.getRefreshToken()}`,
      },
    })
  }

  refreshToken() {
    return this._refreshToken().pipe(this.prepareLoggedInUserPipe())
  }

  private startCalculateTimeout() {
    this.startTimer$.next()
  }

  private listenToIdleTimeout() {
    this.idleService
      .onIdleTimeout()
      .pipe(switchMap(() => this.logout()))
      .subscribe(() => {
        this.router.navigate(['/auth/login']).then()
        this.messageService.showInfo(this.lang.locals.session_timeout)
      })
  }
}
