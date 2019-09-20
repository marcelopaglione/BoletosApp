import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material';

import { ButtonModule } from '../button/button.module';
import { FormDebugComponent } from './form-debug.component';

@NgModule({
  declarations: [ FormDebugComponent ],
  exports: [ FormDebugComponent ],
  imports: [ CommonModule, MatCardModule, ButtonModule ]
})
export class FormDebugModule { }
