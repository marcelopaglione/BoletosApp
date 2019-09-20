import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { MessageService } from '../app-common/log-message/log-message.service';
import { Cidade } from '../entity/Cidade';
import { Estado } from '../entity/Estado';

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

  getEstadosByUf(uf: string): Observable<Estado[]> {
    this.messages.add(`DropdownService - GET ${this.estadosResource}?sigla=${uf}`);
    return this.http.get<Estado[]>(`${this.estadosResource}?sigla=${uf}`);
  }

  getEstadosBr(): Observable<Estado[]> {
    this.messages.add(`DropdownService - GET ${this.estadosResource}`);
    return this.http.get<Estado[]>(this.estadosResource);
  }

  getCidadesByEstadoId(estadoId: number): Observable<Cidade[]> {
    this.messages.add(`DropdownService - GET ${this.cidadesResource}?estado=${estadoId}`);
    return this.http.get<Cidade[]>(`${this.cidadesResource}?estado=${estadoId}`);
  }

  getCidadesByName(cidade: string): Observable<Cidade[]> {
    this.messages.add(`DropdownService - GET ${this.cidadesResource}?nome=${cidade}`);
    return this.http.get<Cidade[]>(`${this.cidadesResource}?nome=${cidade}`);
  }
}
