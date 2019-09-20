import { NgModule } from '@angular/core';

import { ButtonModule } from './button/button.module';
import { FooterModule } from './footer/footer.module';
import { FormDebugModule } from './form-debug/form-debug.module';
import { LogMessageModule } from './log-message/log-message.module';

@NgModule({
  exports: [ ButtonModule, FormDebugModule, FooterModule, LogMessageModule ],
  imports: [ ButtonModule, FormDebugModule, FooterModule, LogMessageModule ]
})
export class AppCommonModule { }
