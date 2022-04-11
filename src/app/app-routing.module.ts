import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import { MarketViewComponent } from './pages/market-view/market-view.component';
import { OrderDepthComponent } from './pages/order-depth/order-depth.component';
import { MarketTradesComponent } from './pages/market-trades/market-trades.component';
import { OrderEntryComponent } from './pages/order-entry/order-entry.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { MyTradesComponent } from './pages/my-trades/my-trades.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import {AuthGuard} from './core/guards/auth.guard';
import { WithoutTokenGuard } from './core/guards/withoutToken.guard';

const childrenComponents = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'order-depth',
    component: OrderDepthComponent
  },
  {
    path: 'market-trades',
    component: MarketTradesComponent
  },
  {
    path: 'order-entry',
    component: OrderEntryComponent
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent
  },
  {
    path: 'my-trades',
    component: MyTradesComponent
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
