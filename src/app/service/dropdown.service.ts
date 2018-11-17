import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  APIEstados = environment.APIEstados + '/estados';
  APICidades = environment.APICidades + '/cidades';

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
