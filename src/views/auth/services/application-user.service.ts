import { inject, Injectable, signal } from '@angular/core'
import { ApplicationUser } from '../models/application-user'
import { UrlService } from '@/services/url.service'
import { HttpClient } from '@angular/common/http'
import { catchError, map, mergeMap, Observable, of, Subscription, take, tap, timer } from 'rxjs'
import { Router } from '@angular/router'
import { STORAGE_ITEMS } from '@/constants/storage-items'
import { CONFIGURATIONS } from '../../../resources/configurations'
import { MessageService } from '@/services/message.service'
import { LocalService } from '@/services/local.service'
import { EXPIRY_MINUTES } from '@/constants/token-expiry-time'
import { SpeechService } from '@/services/speech.service'
import { AppStore } from '@/stores/app.store'
import { IdleMonitorService } from '@/services/idle-monitor.service'

/**
 * @deprecated
 */
@Injectable({
  providedIn: 'root',
})
export class ApplicationUserService {
  private readonly _http = inject(HttpClient)
  private readonly _urlService = inject(UrlService)
  private readonly _router = inject(Router)
  private readonly messagesService = inject(MessageService)
  private readonly lang = inject(LocalService)
  private readonly commonService = inject(SpeechService)
  private readonly store = inject(AppStore)
  private readonly idleMonitor = inject(IdleMonitorService)

  $applicationUser = signal<ApplicationUser>(new ApplicationUser())
  $isAuthenticated = signal<boolean>(false)
  declare logoutSubscription: Subscription

  login(username: string, password: string): Observable<ApplicationUser> {
    const url = `${this._urlService.URLS.USER}/login`

    return this._http.post<ApplicationUser>(url, { username, password }).pipe(
      tap(res =>
        this.$applicationUser.update(state => {
          state.access_token = res.access_token
          state.refresh_token = res.refresh_token
          state.permissions = res.permissions
          state.user_id = res.user_id
          state.username = res.username
          return state
        })
      ),
      tap(res => localStorage.setItem(STORAGE_ITEMS.USER, JSON.stringify(res))),
      tap(res => localStorage.setItem(STORAGE_ITEMS.PERMISSIONS_KEYS, JSON.stringify(res.permissions.map(p => p.key)))),
      tap(() => this.$isAuthenticated.set(true)),
      tap(() => this._router.navigate(['/home'])),
      tap(() =>
        this.messagesService.showInfo(`${this.lang.locals.welcome_user}, ${username}! ${this.lang.locals.welcome_back}`)
      ),
      tap(() => localStorage.setItem(STORAGE_ITEMS.USERNAME, username)),
      tap(() => this.setExpirationSession()),
      mergeMap(user => this.handleSpeechToken(user)),
      catchError(() => {
        this.$isAuthenticated.set(false)
        this.messagesService.showError(`${this.lang.locals.login_failed}`)
        return of(new ApplicationUser())
      })
    ) as Observable<ApplicationUser>
  }
  generateRefreshToken() {
    const url = `${this._urlService.URLS.USER}/refresh-token`
    this.$applicationUser().isRefreshing.set(true)
    const options = { headers: { [CONFIGURATIONS.TOKEN_HEADER_KEY]: this.$applicationUser().refresh_token } }
    return this._http.get<{ refresh_token: string }>(url, options).pipe(
      tap(res =>
        this.$applicationUser.update(state => {
          state.refresh_token = res.refresh_token
          return state
        })
      ),
      tap(() => this.$applicationUser().isRefreshing.set(false)),
      catchError(() => {
        this.$applicationUser().isRefreshing.set(false)
        return of({ refresh_token: '' })
      })
    )
  }
  generateAccessToken() {
    const url = `${this._urlService.URLS.USER}/access-token`
    const options = { headers: { [CONFIGURATIONS.TOKEN_HEADER_KEY]: this.$applicationUser().access_token } }
    return this._http.get<{ access_token: string }>(url, options).pipe(
      tap(
        res =>
          this.$applicationUser.update(state => {
            state.access_token = res.access_token
            return state
          }),
        catchError(() => {
          this._router.navigate(['/auth/login'])
          return of({ access_token: '' })
        })
      )
    )
  }

  logout(): void {
    this.$isAuthenticated.set(false)
    this.$applicationUser.set(new ApplicationUser())
    localStorage.removeItem(STORAGE_ITEMS.USER)
    localStorage.removeItem(STORAGE_ITEMS.TOKEN_EXPIRY)
    this.logoutSubscription?.unsubscribe()
    this._router.navigate(['/auth/login']).then()
  }

  startAutoLogout(expiryTime: number) {
    const timeRemaining = expiryTime - Date.now()

    // Cancel previous timer if any
    this.logoutSubscription?.unsubscribe()

    // Setup new timer
    this.logoutSubscription = timer(timeRemaining).subscribe(() => {
      this.logout()
      this.messagesService.showError(this.lang.locals.session_timeout)
    })
  }

  checkAutoLogoutOnRefresh() {
    const expiryStr = localStorage.getItem(STORAGE_ITEMS.TOKEN_EXPIRY)
    if (!expiryStr) return
    const expiryTime = parseInt(expiryStr, 10)
    const now = Date.now()

    if (now >= expiryTime) {
      this.logout()
      this.messagesService.showError(this.lang.locals.session_timeout)
    } else {
      this.startAutoLogout(expiryTime)
      this.setupIdleMonitor(expiryTime)
    }
  }
  setExpirationSession() {
    const expiry = Date.now() + EXPIRY_MINUTES * 60 * 1000
    localStorage.setItem(STORAGE_ITEMS.TOKEN_EXPIRY, expiry.toString())
    this.startAutoLogout(expiry)
    this.setupIdleMonitor(expiry)
  }

  setupIdleMonitor(expiryTime: number) {
    const refreshThreshold = (EXPIRY_MINUTES - 5) * 60 * 1000
    const now = Date.now()
    const refreshTime = expiryTime - refreshThreshold
    const timeUntilCheck = refreshTime - now

    if (timeUntilCheck <= 0) return

    timer(timeUntilCheck).subscribe(() => {
      this.idleMonitor
        .getIdleStatus()
        .pipe(take(1))
        .subscribe(isIdle => {
          if (!isIdle) {
            this.generateAccessToken().subscribe(() => {
              this.setExpirationSession()
            })
          } else {
            console.log('[Idle] User inactive at refresh point. Will logout normally.')
          }
        })
    })
  }

  getUsername() {
    return localStorage.getItem(STORAGE_ITEMS.USERNAME) ?? ''
  }
  private handleSpeechToken(user: ApplicationUser): Observable<ApplicationUser> {
    return this.commonService.generateSpeechToken().pipe(
      tap(token => this.store.updateSpeechToken(token)),
      catchError(error => {
        console.error('Error generating speech token:', error)
        return of(null)
      }),
      map(() => user)
    )
  }
}
