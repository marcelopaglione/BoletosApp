import { NgModule } from '@angular/core';

import { ButtonModule } from './button/button.module';
import { FormDebugModule } from './form-debug/form-debug.module';

@NgModule({
  exports: [ ButtonModule, FormDebugModule ],
  imports: [ ButtonModule, FormDebugModule ]
})
export class AppCommonModule { }
