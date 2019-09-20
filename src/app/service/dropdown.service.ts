import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { environment } from '../../environments/environment';
import { MessageService } from '../app-common/log-message/message.service';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  APIEstados = environment.API + '/estados';
  APICidades = environment.API + '/cidades';

  constructor(
    private http: Http,
    private messages: MessageService
  ) { }

  getEstadosByUf(uf) {
    this.messages.add('DropdownService - GET ' + this.APIEstados + '?sigla=' + uf);
    return this.http.get(this.APIEstados + '?sigla=' + uf)
      .pipe(map(res => res.json()));
  }

  getEstadosBr() {
    this.messages.add('DropdownService - GET ' + this.APIEstados);
    return this.http.get(this.APIEstados)
      .pipe(map(res => res.json()));
  }

  getCidadesByEstadoId(estadoId) {
    this.messages.add('DropdownService - GET' + this.APICidades + '?estado=' + estadoId);
    return this.http.get(this.APICidades + '?estado=' + estadoId)
      .pipe(map(res => res.json()));
  }

  getCidadesByName(cidade) {
    this.messages.add('DropdownService - GET' + this.APICidades + '?nome=' + cidade);
    return this.http.get(this.APICidades + '?nome=' + cidade)
      .pipe(map(res => res.json()));
  }
}
