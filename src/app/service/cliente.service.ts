import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { MessageService } from '../app-common/log-message/log-message.service';
import { Cliente } from '../entity/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly API = environment.API + '/clientes';

  public getClienteList() {
    this.messages.add(`API: ${this.API} - GET`);
    return this.http.get<Cliente[]>(this.API);
  }

  public deleteById(id) {
    this.messages.add(`API: ${this.API}/${id} - DELETE`);
    return this.http.delete(`${this.API}/${id}`);
  }

  public setCliente(cliente: Cliente) {
    if (cliente.id == null) {
      this.messages.add(`${this.API}- POST: ' + ${JSON.stringify(cliente)}`);
      return this.http.post(`${this.API}`, cliente);
    } else {
      this.messages.add(`${this.API}/${cliente.id} - PUT: ' + ${JSON.stringify(cliente)}`);
      return this.http.put(`${this.API}/${cliente.id}`, cliente);
    }
  }

  getTabelaHeaders() {
    return [
      'id',
      'nome',
      'telefone',
      'valor',
      'cep',
      'rua',
      'numero',
      'cidade',
      'acoes'
    ];
  }

  constructor(
    private http: HttpClient,
    private messages: MessageService
  ) { }
}
