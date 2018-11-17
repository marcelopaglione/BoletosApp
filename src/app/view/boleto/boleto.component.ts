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
import { ConfigService } from '../../service/config.service';
import { Config } from 'src/app/entity/Config';
import { format } from 'libphonenumber-js';

@Component({
  selector: 'app-boleto',
  templateUrl: './boleto.component.html',
  styleUrls: ['./boleto.component.scss']
})
export class BoletoComponent implements OnInit {

  boletos: Boleto[];
  clientes: Cliente[] = [];
  emissor: Emissor;
  prefferedConfig: Config;

  headElements: string[];
  fg: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private boletoService: BoletoService,
    private clienteService: ClienteService,
    private emissorService: EmissorService,
    private messages: MessageService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.messages.add('*** Página Boleto.Componenet aberta ***');
    this.configService.getConfig().subscribe(data => {
      this.prefferedConfig = data;
      this.fg.patchValue({ parcela: data.parcelas });
    });
    this.fg = this.formBuilder.group({
      id: [null],
      cliente: [null, [Validators.required]],
      emissor: [null, [Validators.required]],
      parcela: [null, [Validators.required]],
      dataPrimeiraParcela: [null, Validators.required]
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
    this.messages.add('Editar: ' + JSON.stringify(c));
    this.fg.patchValue(c);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      this.messages.add(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messages.add(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  limparForm() {
    this.fg.reset();
    this.fg.patchValue({ emissor: this.emissor });
    this.configService.getConfig().subscribe(data => {
      this.fg.patchValue({ parcela: data.parcelas });
      if (data.currentdate) {
        this.fg.patchValue({ dataPrimeiraParcela: new Date().toLocaleString().slice(0, 10) });
      }
    });
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

  verificaValidacoesForm(form: FormGroup) {
    Object.keys(form.controls).forEach(campo => {
      const controle = form.get(campo);
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  verificaValidTouched(campo: string) {
    return !this.fg.get(campo).valid && this.fg.get(campo).touched;
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
