import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';

import { ButtonComponent } from './button.component';

@NgModule({
  declarations: [ ButtonComponent ],
  exports: [ ButtonComponent ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class ButtonModule { }
