import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatChipsModule, MatExpansionModule } from '@angular/material';

import { ButtonModule } from '../button/button.module';
import { LogMessageComponent } from './log-message.component';

@NgModule({
  declarations: [ LogMessageComponent ],
  exports: [ LogMessageComponent ],
  imports: [ CommonModule, MatCardModule, ButtonModule, MatExpansionModule, MatChipsModule ]
})
export class LogMessageModule { }
