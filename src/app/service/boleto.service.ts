import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { Boleto } from '../entity/Boleto';
import { ClienteService } from './cliente.service';
import { Cliente } from '../entity/Cliente';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoletoService {

  private readonly API = environment.API + '/boleto';

  public getBoletoList() {
    this.messages.add(`API: ${this.API} - GET`);
    return this.http.get<Boleto[]>(this.API);
  }

  public deleteById(id){
    this.messages.add(`API: ${this.API}/${id} - DELETE`);
    return this.http.delete(`${this.API}/${id}`);
  }

  public setBoleto(boleto: Boleto) {
    if (boleto.id == null) {
      console.log(boleto);
      this.messages.add(`${this.API} - POST: ' + ${JSON.stringify(boleto)}`);
      return this.http.post(`${this.API}`, boleto);
    } else {
      this.messages.add(`${this.API}/${boleto.id} - PUT: ' + ${JSON.stringify(boleto)}`);
      return this.http.put(`${this.API}/${boleto.id}`, boleto);
    }
  }

  getTabelaHeaders() {
    return [
      'ID',
      'Cliente',
      'Emissor',
      'Valor',
      'Parcelas',
      'Data Primeira Parcela',
      'Ações'
    ];
  }

  constructor(
    private http: HttpClient,
    private messages: MessageService,
    private clienteService: ClienteService
  ) { }
}
