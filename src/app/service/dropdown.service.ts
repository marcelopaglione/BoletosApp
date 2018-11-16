import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(
    private http: Http
  ) { }

  getEstadosBr() {
    return this.http.get('assets/shared/estados.json')
    .pipe(map(res => res.json()));
  }
}
