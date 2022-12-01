import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MarketViewComponent } from './pages/market-view/market-view.component';
import { OrderDepthComponent } from './pages/order-depth/order-depth.component';
import { MarketTradesComponent } from './pages/market-trades/market-trades.component';
import { OrderEntryComponent } from './pages/order-entry/order-entry.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { MyTradesComponent } from './pages/my-trades/my-trades.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { AngularSplitModule } from 'angular-split';
import { HomeComponent } from './pages/home/home.component';
import { TableTitleComponent } from './components/table-title/table-title.component';
import { CoreModule } from './core/core.module';
import { ChooseViewComponent } from './components/choose-view/choose-view.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HttpTokenInterceptor } from './core/interceptors/http.token.interceptor';
import { OrderConfirmComponent } from './pages/order-confirm/order-confirm.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SearchTableComponent } from './components/search-table/search-table.component';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ValueChangeComponent } from './components/value-change/value-change.component';
import { CellComponent } from './components/cell/cell.component';
import { HttpErrorInterceptor } from './core/interceptors/http.error.interceptor';
import { MarketViewSearchComponent } from './components/market-view-search/market-view-search.component';

@NgModule({
  declarations: [
    AppComponent,
    MarketViewComponent,
    OrderDepthComponent,
    MarketTradesComponent,
    OrderEntryComponent,
    MyOrdersComponent,
    MyTradesComponent,
    NavigationComponent,
    HeaderComponent,
    PageLayoutComponent,
    NotFoundComponent,
    LoginComponent,
    HomeComponent,
    TableTitleComponent,
    ChooseViewComponent,
    OrderConfirmComponent,
    ConfirmDialogComponent,
    SearchTableComponent,
    ImportDialogComponent,
    ResetPasswordComponent,
    ValueChangeComponent,
    CellComponent,
    MarketViewSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HttpClientModule,
    AngularSplitModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
