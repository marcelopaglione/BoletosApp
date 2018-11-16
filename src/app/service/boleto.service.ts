import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { Boleto } from '../entity/Boleto';

@Injectable({
  providedIn: 'root'
})
export class BoletoService {

  private readonly API = environment.API + '/boleto';

  public getBoletoList() {
    this.messages.add(`API: ${this.API} - GET`);
    return this.http.get<Boleto[]>(this.API);
  }

  public setBoleto(boleto: Boleto) {
    this.messages.add(`${this.API}/${boleto.id} - PUT: ' + ${JSON.stringify(boleto)}`);
    this.http.put(`${this.API}/${boleto.id}`, Boleto).subscribe(
      r => {
        return r;
      }
    );
  }

  getTabelaHeaders() {
    return [
      'ID',
      'Cliente',
      'Emissor',
      'Valor',
      'Parcelas',
      'Ações'
    ];
  }

  constructor(
    private http: HttpClient,
    private messages: MessageService
  ) { }
}
