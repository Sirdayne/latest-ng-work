import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../store/state/app.state';
import { TokenService } from '../../auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class WithoutTokenGuard implements CanActivate {
  constructor(private store: Store<IAppState>, private router: Router, private tokenService: TokenService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.tokenService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
