import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoCommaPipe } from '../core/pipes/noComma.pipe';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    NoCommaPipe
  ],
  imports: [
    MatTableModule,
    MatButtonModule,
    MatListModule,
    CommonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatTooltipModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatTableModule,
    MatButtonModule,
    MatListModule,
    CommonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatTooltipModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSnackBarModule,
    NoCommaPipe,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    NoCommaPipe
  ]
})
export class SharedModule { }
