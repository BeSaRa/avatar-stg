import { LoginComponent } from '@/views/auth/login/login.component'
import { Routes } from '@angular/router'
import { visitorGuard } from '@/guards/visitor.guard'

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [visitorGuard],
  },
]

export default routes
