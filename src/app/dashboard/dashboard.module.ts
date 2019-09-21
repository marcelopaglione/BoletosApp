import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';

import { AppCommonModule } from '../app-common/app-common.module';
import { DateFormatPipe } from '../shared/date.pipe';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [ DashboardComponent, DateFormatPipe ],
  exports: [ DateFormatPipe ],
  imports: [
    CommonModule,
    AppCommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ]
})
export class DashboardModule { }
