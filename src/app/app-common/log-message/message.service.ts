import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  messages: string[] = [];

  add(message: string) {
    this.messages.unshift(`${new Date().toLocaleString()}: ${message}`);
  }

  clear() {
    this.messages = [];
  }

}
