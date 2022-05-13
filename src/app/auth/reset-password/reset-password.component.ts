import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, CurrentUserI } from '../login/auth.service';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest } from 'rxjs';
import { setUser } from '../../core/store/actions/user.actions';
import { SocketService } from '../../pages/home/socket.service';
import { TokenService } from '../token.service';
import { Store } from '@ngrx/store';
import { IAppState } from '../../core/store/state/app.state';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  loading = false;
  authError;
  hidePassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  confirmPassword = new FormControl('');

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private tokenService: TokenService,
              private socketService: SocketService,
              private snackBar: MatSnackBar,
              private store: Store<IAppState>) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const username = this.route.snapshot.queryParams.username;
    if (username) {
      this.form?.get('username')?.patchValue(username);
    }
    const passwordObs = this.form.get('password')?.valueChanges;
    const newPasswordObs = this.form.get('newPassword')?.valueChanges;
    const confirmPasswordObs = this.confirmPassword.valueChanges;
    combineLatest([newPasswordObs, confirmPasswordObs]
      ).subscribe(([password, confirmPassword]: any) => {
      if (password !== confirmPassword) {
        this.confirmPassword.setErrors({ matchPassword: true });
      } else {
        this.confirmPassword.setErrors(null);
      }
    });

    combineLatest([passwordObs, newPasswordObs]
    ).subscribe(([password, newPassword]: any) => {
      if (password === newPassword) {
        this.form?.get('newPassword')?.setErrors({ samePassword: true });
      } else {
        this.form?.get('newPassword')?.setErrors(null);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.authError = '';
    const msgError = 'Invalid Credentials';
    this.authService.resetPassword(this.form.getRawValue()).pipe(
      finalize(() => this.loading = false)
    ).subscribe((res: CurrentUserI) => {
      if (res && res.accessToken) {
        this.tokenService.setToken(res.accessToken);
        this.socketService.createSocketConnection();
        this.store.dispatch(setUser( { user: {
            name: res.senderSubID,
            role: res.userRole
          }}));
        if (this.form.valid) {
          this.router.navigateByUrl('/');
        }
      } else {
        this.authError = msgError;
      }
    }, (err) => {
      this.authError = err && err.error && err.error.message ? err.error.message : msgError;
    });
  }

}
