import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../core/store/state/app.state';
import {filter, finalize} from 'rxjs/operators';
import {OrderConfirmI, OrderEntryService} from '../order-entry/order-entry.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.css']
})
export class OrderConfirmComponent implements OnInit {
  @Input() orderConfirm: OrderConfirmI;
  @Output() setStep = new EventEmitter();
  @Output() resetParentForm = new EventEmitter();
  form: FormGroup;
  loading = false;
  error;
  sides = OrderEntryService.SIDES;
  types = OrderEntryService.TYPES;
  timeInForces = OrderEntryService.TIMEINFORCES;
  subscription = new Subscription();
  clOrdID;
  confirmReqID;

  constructor(private fb: FormBuilder,
              private store: Store<IAppState>,
              private orderEntryService: OrderEntryService,
              private snackBar: MatSnackBar) {
    this.form = fb.group({
      symbol: [{ value: '', disabled: true }, [Validators.required]],
      repoPeriod: [{ value: '', disabled: true }, [Validators.required]],
      side: [{ value: '', disabled: true }, [Validators.required]],
      ordType: [{ value: '', disabled: true }, [Validators.required]],
      timeInForce: [{ value: '', disabled: true }, []],
      repoRate: [{ value: '', disabled: true }, []],
      autoRepoAmount: [{ value: '', disabled: true }, []],
      autoOrderQty: [{ value: '', disabled: true }, []],
      repurchaseDate: [{ value: '', disabled: true }, []],
      repurchaseAmount: [{ value: '', disabled: true }, []],
      repoPrice: [{ value: '', disabled: true }, []],
      investor: [{ value: '', disabled: true }, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setFormOrderConfirm();

    this.onChange();
  }

  setFormOrderConfirm() {
    this.clOrdID = this.orderConfirm.clOrdID;
    this.confirmReqID = this.orderConfirm.confirmReqID;
    this.f['symbol'].setValue(this.orderConfirm.symbol);
    this.f['repoPeriod'].setValue(this.orderConfirm.repoPeriod);
    this.f['side'].setValue(this.orderConfirm.side);
    this.f['ordType'].setValue(this.orderConfirm.ordType);
    this.f['timeInForce'].setValue(this.orderConfirm.timeInForce);
    this.f['repoRate'].setValue(this.orderConfirm.repoRate);
    this.f['autoRepoAmount'].setValue(this.orderConfirm.autoRepoAmount);
    this.f['autoOrderQty'].setValue(this.orderConfirm.autoOrderQty);
    this.f['repurchaseDate'].setValue(this.orderConfirm.repurchaseDate);
    this.f['repurchaseAmount'].setValue(this.orderConfirm.repurchaseAmount);
    this.f['repoPrice'].setValue(this.orderConfirm.repoPrice);
    this.f['investor'].setValue(this.orderConfirm.investor);
  }

  onChange() {
    this.f['ordType'].valueChanges.subscribe(type => {
      this.f['timeInForce'].setValue('');
      this.refreshNumValues();
    });

    this.f['side'].valueChanges.subscribe(type => {
      this.refreshNumValues();
    });
  }

  refreshNumValues() {
    this.f['repoRate'].setValue('');
    this.f['autoRepoAmount'].setValue('');
    this.f['autoOrderQty'].setValue('');
  }

  get isTypeLimit() {
    return this.f['ordType'].value === 2;
  }

  get isSideSell() {
    return this.f['side'].value === 2;
  }

  onSubmit() {
    this.loading = true;
    this.orderEntryService.confirmOrder(this.confirmReqID).pipe(
      finalize(() => this.loading = false)
    ).subscribe((res: any) => {
      if (res.status === 'CONFIRMED') {
        this.snackBar.open('Order successfully confirmed', 'CLOSE', {
          duration: 3000,
        });
      } else {
        const message = res && res.message ? res.message : "Error: Invalid Data";
        this.snackBar.open(message, 'CLOSE', {
          duration: 3000,
        });
      }
      this.resetForm();
    }, err => {
      this.resetForm();
      const message = err && err.error && err.error.message ? err.error.message : "Error: Invalid Data";
      this.snackBar.open(message, 'CLOSE', {
        duration: 3000,
      });
    });
  }

  onReject() {
    this.loading = true;
    this.orderEntryService.rejectOrder(this.confirmReqID).pipe(
      finalize(() => this.loading = false)
    ).subscribe((res: any) => {
      if (res.status === 'CANCELLED') {
        this.snackBar.open('Order successfully rejected', 'CLOSE', {
          duration: 3000,
        });
      } else {
        const message = res && res.message ? res.message : "Error: Invalid Data";
        this.snackBar.open(message, 'CLOSE', {
          duration: 3000,
        });
      }
      this.resetForm();
    }, err => {
      this.resetForm();
      const message = err && err.error && err.error.message ? err.error.message : "Error: Invalid Data";
      this.snackBar.open(message, 'CLOSE', {
        duration: 3000,
      });
    });
  }

  closeForm() {
    this.setStep.emit('');
    this.form.reset();
    this.clOrdID = null;
    this.confirmReqID = null;
  }

  resetForm() {
    this.setStep.emit('');
    this.resetParentForm.emit();
    this.form.reset();
    this.clOrdID = null;
    this.confirmReqID = null;
  }

  get f() { return this.form.controls; }
}

