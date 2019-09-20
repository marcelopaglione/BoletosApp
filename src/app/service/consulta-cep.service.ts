import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  consultaCEP(cep: string) {
    console.log('Consulta CEP: ' + cep);
    // Remove o que não é dígito
    cep = cep.replace(/\D/g, '');

    if (cep !== '') {
      // Expressão regular para validar o CEP
      const validacep = /^[0-9]{8}$/;

      // Valida o formato do CEP
      if (validacep.test(cep)) {
        return this.http.get(`//viacep.com.br/ws/${cep}/json`);
      }

    }
    return of({});
  }

  constructor(
    private http: HttpClient
  ) { }
}
