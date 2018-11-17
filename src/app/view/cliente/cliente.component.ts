import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../entity/Cliente';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  clientes$: Observable<Cliente[]>;
  headElements;
  fg: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private messages: MessageService
  ) { }

  ngOnInit() {
    this.fg = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.min(3), Validators.max(25)]],
      email: [null, [Validators.email]],
      telefone: [null],
      valor: [null, Validators.required],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
    this.initializePageData();
  }

  initializePageData(): any {
    this.limparForm();
    this.headElements = this.clienteService.getTabelaHeaders();
    this.clientes$ = this.clienteService.getClienteList();
  }

  limparForm() {
    this.fg.reset();
  }

  editar(c: Cliente) {
    this.fg.reset();
    this.fg.patchValue(c);
  }

  delete(id) {
    this.clienteService.deleteById(id).pipe(
      tap(_ => {
        this.messages.add(`deleted id=${id}`);
        this.initializePageData();
      }),
      catchError(this.handleError<any>('delete'))
    ).subscribe();
  }

  onSubmit () {
    if (this.fg.valid) {
      this.clienteService.setCliente(this.fg.value).pipe(
        tap(_ => {
          this.messages.add(`updated ${JSON.stringify(this.fg.value)}`);
          this.initializePageData();
        }),
        catchError(this.handleError<any>('update'))
      ).subscribe();
    } else {
      this.messages.add('Invalid cliente form: ' + JSON.stringify(this.fg.value));
    }
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
