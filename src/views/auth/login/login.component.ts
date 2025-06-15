import { ButtonDirective } from '@/directives/button.directive'
import { LocalService } from '@/services/local.service'
import { MessageService } from '@/services/message.service'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router } from '@angular/router'
import { SpinnerLoaderComponent } from '@/components/spinner-loader/spinner-loader.component'
import { AuthService } from '@/services/auth.service'
import { ignoreErrors } from '@/utils/utils'
import { catchError } from 'rxjs'

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  imports: [CommonModule, ButtonDirective, ReactiveFormsModule, MatTooltipModule, SpinnerLoaderComponent],
})
export class LoginComponent {
  lang = inject(LocalService)
  fb = inject(NonNullableFormBuilder)
  messagesService = inject(MessageService)
  router = inject(Router)
  authService = inject(AuthService)

  form = this.fb.group({
    userName: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  })

  isLoading = false

  onSubmit() {
    if (this.form.invalid) {
      this.messagesService.showInfo('Please fill in all required fields correctly.')
      return
    }
    this.isLoading = true
    const { userName: username, password } = this.form.getRawValue()
    this.authService
      .login({
        username,
        password,
      })
      .pipe(
        catchError(err => {
          this.messagesService.showError(`${this.lang.locals.login_failed}`)
          return err
        })
      )
      .pipe(ignoreErrors())
      .subscribe(() => {
        this.messagesService.showInfo(`${this.lang.locals.welcome_user}, ${username}! ${this.lang.locals.welcome_back}`)
        this.router.navigateByUrl('/home').then()
      })
  }
}
