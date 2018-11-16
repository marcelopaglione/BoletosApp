import { Injectable } from '@angular/core';
import { Cliente } from '../entity/Cliente';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly API = environment.API + '/cliente';

  public getClienteList() {
    this.messages.add(`API: ${this.API} - GET`);
    return this.http.get<Cliente[]>(this.API);
  }

  public setCliente(cliente: Cliente) {
    this.messages.add(`${this.API}/${cliente.id} - PUT: ' + ${JSON.stringify(cliente)}`);
    this.http.put(`${this.API}/${cliente.id}`, cliente).subscribe(
      r => {
        return r;
      }
    );
  }

  getTabelaHeaders() {
    return [
      'ID',
      'Nome',
      'Email',
      'Telefone',
      'Cep',
      'Rua',
      'Numero',
      'Cidade',
      'Valor',
      'Ações'
    ];
  }

  constructor(
    private http: HttpClient,
    private messages: MessageService
  ) { }
}
