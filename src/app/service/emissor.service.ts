import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { MessageService } from '../app-common/log-message/log-message.service';
import { Emissor } from '../entity/Emissor';

@Injectable({
  providedIn: 'root'
})
export class EmissorService {

  private readonly API = environment.API + '/emissors';

  public getEmissor() {
    this.messages.add(`API: ${this.API} - GET`);
    return this.http.get<Emissor>(this.API);
  }

  public setEmissor(emissor: Emissor) {
    this.messages.add(`API: ${this.API}/${emissor.id} - PUT: ${JSON.stringify(emissor)}`);
    this.http.put(`${this.API}/${emissor.id}`, emissor).subscribe(
      r => {
        return r;
      }
    );
  }

  constructor(
    private http: HttpClient,
    private messages: MessageService
  ) { }
}
