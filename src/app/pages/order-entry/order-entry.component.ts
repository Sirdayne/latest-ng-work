import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../../core/store/state/app.state';
import { Subscription } from 'rxjs';
import { selectCurrentUser } from '../../core/store/selectors/user.selectors';
import {filter, finalize} from 'rxjs/operators';
import {OrderConfirmI, OrderEntryService} from './order-entry.service';

@Component({
  selector: 'app-order-entry',
  templateUrl: './order-entry.component.html',
  styleUrls: ['./order-entry.component.css']
})
export class OrderEntryComponent implements OnInit {
  step = 'start';
  form: FormGroup;
  loading = false;
  sides = OrderEntryService.SIDES;
  types = OrderEntryService.TYPES;
  timeInForces = OrderEntryService.TIMEINFORCES;

  orderConfirm: OrderConfirmI = {} as OrderConfirmI;
  error = '';

  constructor(private fb: FormBuilder,
              private store: Store<IAppState>,
              private orderEntryService: OrderEntryService) {
    this.form = fb.group({
      symbol: ['', [Validators.required]],
      repoPeriod: ['', [Validators.required]],
      side: ['', [Validators.required]],
      ordType: ['', [Validators.required]],
      timeInForce: ['', []],
      repoRate: ['', []],
      repoAmount: ['', []],
      repoQuantity: ['', []],
      investor: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.onChange();
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
    this.f['repoAmount'].setValue('');
    this.f['repoQuantity'].setValue('');
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    const body = this.removeEmptyValuesFromForm();
    this.orderEntryService.createOrderEntry(body).pipe(
      finalize(() => this.loading = false)
    ).subscribe(res => {
      this.orderConfirm = res;
      this.step = 'order-confirm';
    }, err => {
      this.error = err && err.error && err.error.message ? err.error.message : "Error: Invalid Data";
    });
  }

  removeEmptyValuesFromForm() {
    const body = {};
    Object.keys(this.form.getRawValue()).forEach(key => {
      if (this.form?.get(key)?.value) {
        body[key] = this.form?.get(key)?.value;
      }
    });
    return body;
  }

  get isTypeMarket() {
    return this.f['ordType'].value === '1';
  }

  get isTypeLimit() {
    return this.f['ordType'].value === '2';
  }

  get isSideSell() {
    return this.f['side'].value === '2';
  }

  get f() { return this.form.controls; }

  setStep(step) {
    this.step = step;
  }

  resetParentForm() {
    this.form.reset();
  }
}
