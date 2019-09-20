import { NgModule } from '@angular/core';

import { ButtonModule } from './button/button.module';

@NgModule({
  exports: [ ButtonModule ],
  imports: [ ButtonModule ]
})
export class AppCommonModule { }
