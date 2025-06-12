import { inject, Injectable } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { ConfigService } from '@/services/config.service'

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  cookieService = inject(CookieService)
  config = inject(ConfigService)
  private accessToken = ''

  setAccessToken(token: string): void {
    this.cookieService.set(this.config.CONFIG.ACCESS_TOKEN_COOKIE_NAME, token, {
      path: '/',
    })
    this.accessToken = token
  }

  removeAccessToken(): void {
    this.accessToken = ''
    this.cookieService.delete(this.config.CONFIG.ACCESS_TOKEN_COOKIE_NAME)
  }

  getAccessToken() {
    return this.accessToken
  }

  hasAccessToken() {
    return !!this.accessToken
  }

  removeRefreshToken(): void {
    this.cookieService.delete(this.config.CONFIG.REFRESH_TOKEN_COOKIE_NAME)
  }

  getRefreshToken() {
    return this.cookieService.get(this.config.CONFIG.REFRESH_TOKEN_COOKIE_NAME)
  }

  hasRefreshToken() {
    return !!this.cookieService.get(this.config.CONFIG.REFRESH_TOKEN_COOKIE_NAME)
  }

  setRefreshToken(refresh_token: string) {
    this.cookieService.set(this.config.CONFIG.REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
      path: '/',
    })
  }

  setTokens(refreshToken: string, access_token: string) {
    this.setRefreshToken(refreshToken)
    this.setAccessToken(access_token)
  }

  removeTokens() {
    this.removeAccessToken()
    this.removeRefreshToken()
  }
}
