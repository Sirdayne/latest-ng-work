import { Injectable } from '@angular/core';
import { SocketService } from '../pages/home/socket.service';
import { TokenService } from './token.service';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private authService: AuthService,
              private socketService: SocketService,
              private tokenService: TokenService,
              private router: Router) { }

  logoutAllSessions() {
    this.socketService.socket.close();
    this.authService.logout().subscribe(res => {});
    this.tokenService.removeToken();
    this.router.navigateByUrl('/login');
  }
}
