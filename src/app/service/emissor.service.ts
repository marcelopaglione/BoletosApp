import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, take } from 'rxjs/operators';
import { Emissor } from '../entity/Emissor';

@Injectable({
  providedIn: 'root'
})
export class EmissorService {

  private readonly API = environment.API + '/emissor';

  public getEmissor() {
    return this.http.get<Emissor>(this.API);
  }

  public setEmissor(emissor: Emissor) {
    this.http.put(this.API, emissor).subscribe(
      r => {
        return r;
      }
    );
  }

  constructor(
    private http: HttpClient
  ) { }
}
