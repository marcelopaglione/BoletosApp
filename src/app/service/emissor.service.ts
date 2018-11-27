import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, take } from 'rxjs/operators';
import { Emissor } from '../entity/Emissor';
import { MessageService } from './message.service';

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
