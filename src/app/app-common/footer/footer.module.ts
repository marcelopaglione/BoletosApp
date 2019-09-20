import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';

import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [ FooterComponent ],
  exports: [ FooterComponent ],
  imports: [ CommonModule, MatToolbarModule ]
})
export class FooterModule { }
