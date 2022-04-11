import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {AuthService} from '../../auth/login/auth.service';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../../core/store/state/app.state';
import { selectCurrentUser } from '../../core/store/selectors/user.selectors';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TokenService } from '../../auth/token.service';
import { SessionService } from '../../auth/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  layouts = [
    {
      views: [
        {
          name: 'market-view',
          size: 40
        },
        {
          name: 'order-entry',
          size: 30
        },
        {
          name: '',
          size: 30
        }
      ]
    },
    {
      views: [
        {
          name: 'my-orders',
          size: 33
        },
        {
          name: 'my-trades',
          size: 33
        },
        {
          name: 'market-trades',
          size: 33
        }
      ]
    }
  ];

  username = 'Unknown';
  LAYOUTS_LOCAL_STORAGE_NAME = 'web_trader_layouts';

  constructor(private cdRef: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private router: Router,
              private authService: AuthService,
              private store: Store<IAppState>,
              private tokenService: TokenService,
              private sessionService: SessionService) {
    this.subscription.add(this.store.pipe(
      select(selectCurrentUser),
      filter(user => user !== null)
    ).subscribe(user => {
      this.username = user && user.name ? user.name : 'Unknown';
    }));
  }

  ngOnInit(): void {
    this.getFromStorage();
  }

  addLayout() {
    this.layouts.push({
      views: []
    });
  }

  removeView(views, index) {
    views = views.splice(index, 1);
  }

  removeLayout(index) {
    this.layouts.splice(index, 1);
  }

  addView(views) {
    views.push({
      name: '',
      size: 25
    });
  }

  saveToStorage() {
    localStorage.setItem(this.LAYOUTS_LOCAL_STORAGE_NAME, JSON.stringify(this.layouts));
    this.snackBar.open('Arrangement of Views Saved', 'CLOSE', {
      duration: 3000,
    });
  }

  selectView(view, layoutIndex, index) {
    this.layouts[layoutIndex].views[index].name = view;
  }

  getFromStorage() {
    const layouts = localStorage.getItem(this.LAYOUTS_LOCAL_STORAGE_NAME);
    if (layouts) {
      try {
        this.layouts = JSON.parse(layouts);
      } catch (e) {
        console.log('Parse Cache Error:' + e);
      }
    }
  }

  trackByFn(index, item) {
    return index;
  }

  logout() {
    this.sessionService.logoutAllSessions();
  }

  dragEnd(views, { sizes }) {
    views.forEach((view, index) => {
      view.size = sizes[index];
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

