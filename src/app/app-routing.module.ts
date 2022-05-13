import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import {AuthGuard} from './core/guards/auth.guard';
import { WithoutTokenGuard } from './core/guards/withoutToken.guard';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const childrenComponents = [
  {
    path: '',
    component: HomeComponent
  },
];

const routes: Routes = [
  {
    path: '',
    component: PageLayoutComponent,
    canActivate: [AuthGuard],
    children: childrenComponents
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [WithoutTokenGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
