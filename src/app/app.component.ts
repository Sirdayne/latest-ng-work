import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/login/auth.service';
import {Router} from '@angular/router';
import { setUser } from './core/store/actions/user.actions';
import { Store } from '@ngrx/store';
import { IAppState } from './core/store/state/app.state';
import { SocketService } from './pages/home/socket.service';
import { TokenService } from './auth/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WebTrader';

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<IAppState>,
              private socketService: SocketService,
              private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(res => {
      this.store.dispatch(setUser( { user: {
        name: res.senderSubID,
        role: res.userRole
      }}));

      this.socketService.createSocketConnection();
    }, err => {
      this.router.navigateByUrl('/login');
      this.tokenService.removeToken();
    });
  }
}
