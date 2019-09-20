import { Component } from '@angular/core';

import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: [ './message.component.scss' ]
})
export class MessageComponent {

  constructor(
    public messages: MessageService
  ) { }

  click() {
    this.messages.clear();
  }

}
