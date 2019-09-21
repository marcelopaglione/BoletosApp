import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatCardModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatProgressSpinnerModule,
    MatSelectModule
} from '@angular/material';

import { AppCommonModule } from '../app-common/app-common.module';
import { EmissorComponent } from './emissor.component';

@NgModule({
  declarations: [ EmissorComponent ],
  exports: [ EmissorComponent ],
  imports: [
    CommonModule,
    AppCommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ]
})
export class EmissorModule { }
