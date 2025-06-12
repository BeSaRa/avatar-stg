import { inject, Injectable } from '@angular/core'
import { UrlService } from '@/services/url.service'
import { HttpClient, HttpContext } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { CastResponse } from 'cast-response'
import { LoginData } from '@/models/login-data'
import { TokenService } from '@/services/token.service'
import { EmployeeService } from '@/services/employee.service'
import { NO_ACCESS_TOKEN } from '@/http-contexts/no-access-token'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly urlService = inject(UrlService)
  private readonly tokenService = inject(TokenService)
  private readonly employeeService = inject(EmployeeService)

  @CastResponse(() => LoginData)
  private _login(credentials: { username: string; password: string }): Observable<LoginData> {
    return this.http.post<LoginData>(`${this.urlService.URLS.USER}/login`, credentials)
  }

  private prepareLoggedInUserPipe() {
    return tap((data: LoginData) => {
      data.preparePermissions()
      this.tokenService.setTokens(data.refresh_token, data.access_token)
      this.employeeService.setCurrentUser(data)
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
}
