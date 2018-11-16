import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  messages: string[] = [];

  add(message: string) {
    this.messages.push(`${new Date().toLocaleString()}: ${message}`);
  }

  clear() {
    this.messages = [];
  }

}
