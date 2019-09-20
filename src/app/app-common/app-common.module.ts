import { NgModule } from '@angular/core';

import { ButtonModule } from './button/button.module';
import { FooterModule } from './footer/footer.module';
import { FormDebugModule } from './form-debug/form-debug.module';

@NgModule({
  exports: [ ButtonModule, FormDebugModule, FooterModule ],
  imports: [ ButtonModule, FormDebugModule, FooterModule ]
})
export class AppCommonModule { }
