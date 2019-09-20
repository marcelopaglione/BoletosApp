import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { MessageService } from '../app-common/log-message/log-message.service';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  estadosResource = `${environment.API}/estados`;
  cidadesResource = `${environment.API}/cidades`;

  constructor(
    private http: HttpClient,
    private messages: MessageService
  ) { }

  getEstadosByUf(uf) {
    this.messages.add(`DropdownService - GET ${this.estadosResource}?sigla=${uf}`);
    return this.http.get(`${this.estadosResource}?sigla=${uf}`);
  }

  getEstadosBr() {
    this.messages.add(`DropdownService - GET ${this.estadosResource}`);
    return this.http.get(this.estadosResource);
  }

  getCidadesByEstadoId(estadoId) {
    this.messages.add(`DropdownService - GET ${this.cidadesResource}?estado=${estadoId}`);
    return this.http.get(`${this.cidadesResource}?estado=${estadoId}`);
  }

  getCidadesByName(cidade) {
    this.messages.add(`DropdownService - GET ${this.cidadesResource}?nome=${cidade}`);
    return this.http.get(`${this.cidadesResource}?nome=${cidade}`);
  }
}
