import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TokenService } from '../../auth/token.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          this.router.navigateByUrl('login');
          this.tokenService.removeToken();
          this.snackBar.open('Session expired', 'CLOSE', {
            duration: 3000,
          });
        }
        return throwError(error)
      })
    );
  }
}
