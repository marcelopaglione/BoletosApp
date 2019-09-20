import { Component } from '@angular/core';

import { MessageService } from './message.service';

@Component({
  selector: 'app-log-message',
  templateUrl: './log-message.component.html',
  styleUrls: [ './log-message.component.scss' ]
})
export class LogMessageComponent {

  panelOpenState = true;

  constructor(
    public messages: MessageService
  ) { }

  click() {
    this.messages.clear();
  }

}
