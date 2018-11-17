import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../entity/Cliente';
import { Boleto } from '../../entity/Boleto';
import { BoletoService } from '../../service/boleto.service';
import { Emissor } from 'src/app/entity/Emissor';
import { EmissorService } from '../../service/emissor.service';

@Component({
  selector: 'app-boleto',
  templateUrl: './boleto.component.html',
  styleUrls: ['./boleto.component.scss']
})
export class BoletoComponent implements OnInit {

  boletos: Boleto[];
  clientes: Cliente[] = [];
  emissor: Emissor;

  headElements: string[];
  fg: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private boletoService: BoletoService,
    private clienteService: ClienteService,
    private emissorService: EmissorService,
    private messages: MessageService
  ) { }

  ngOnInit() {
    this.fg = this.formBuilder.group({
      id: [null],
      cliente: [null, [Validators.required]],
      emissor: [null, [Validators.required]],
      parcela: [null, [Validators.required]]
    });

    this.initializePageData();
  }

  initializePageData() {
    this.limparForm();
    this.headElements = this.boletoService.getTabelaHeaders();
    this.boletoService.getBoletoList().subscribe(data => {
      this.boletos = data;
    });
    this.clienteService.getClienteList().subscribe(data => {
      this.clientes = data;
    });
    this.emissorService.getEmissor().subscribe(data => {
      this.emissor = data;
      this.fg.patchValue({ emissor: data });
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  editar(c: Boleto) {
    this.limparForm();
    this.fg.patchValue(c);
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

  limparForm() {
    this.fg.reset();
    this.fg.patchValue({ emissor: this.emissor });
  }

  delete(id) {
    this.boletoService.deleteById(id).pipe(
      tap(_ => {
        this.messages.add(`deleted id=${id}`);
        this.initializePageData();
      }),
      catchError(this.handleError<any>('delete'))
    ).subscribe();
  }

  onSubmit() {
    if (this.fg.valid) {
      this.boletoService.setBoleto(this.fg.value).pipe(
        tap(_ => {
          this.messages.add(`updated ${JSON.stringify(this.fg.value)}`);
          this.initializePageData();
        }),
        catchError(this.handleError<any>('update'))
      ).subscribe();
    } else {
      this.messages.add('Invalid boleto form: ' + JSON.stringify(this.fg.value));
    }
  }

}
