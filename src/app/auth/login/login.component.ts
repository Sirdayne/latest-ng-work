import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IAppState } from '../../core/store/state/app.state';
import { Store } from '@ngrx/store';
import { setUser } from '../../core/store/actions/user.actions';
import {AuthService, LoginResponseI} from './auth.service';
import {finalize} from 'rxjs/operators';
import { TokenService } from '../token.service';
import { SocketService } from '../../pages/home/socket.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  authError;

  constructor(private fb: FormBuilder,
              private router: Router,
              private store: Store<IAppState>,
              private authService: AuthService,
              private tokenService: TokenService,
              private socketService: SocketService) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.authError = '';
    this.authService.login(this.form.getRawValue()).pipe(
      finalize(() => this.loading = false)
    ).subscribe((res: LoginResponseI) => {
      if (res && res.accessToken) {
        this.tokenService.setToken(res.accessToken);
        this.socketService.createSocketConnection();
        this.store.dispatch(setUser( { user: {
            name: this.form.get('username')?.value,
            role: 'Trader'
          }}));
        if (this.form.valid) {
          this.router.navigateByUrl('/');
        }
      } else {
        this.authError = 'Authentication failed';
      }
    }, (err) => {
      this.authError = err && err.error && err.error.message ? err.error.message : "Authentication failed";
    });
  }

}
