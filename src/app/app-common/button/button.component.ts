import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {

  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() disabled = false;
  @Input() type: 'submit' | 'text' = 'text';
  @Input() tooltip = '';

  @Output() onclick = new EventEmitter<any>();

  onClick(event) {
    this.onclick.emit(event);
  }
}
