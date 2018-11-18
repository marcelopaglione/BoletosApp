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

  public deleteById(id){
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
      'email',
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
