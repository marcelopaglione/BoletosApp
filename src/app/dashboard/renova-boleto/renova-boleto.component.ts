import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { MessageService } from '../../app-common/log-message/log-message.service';
import { Boleto } from '../../entity/Boleto';
import { Cliente } from '../../entity/Cliente';
import { Config } from '../../entity/Config';
import { Emissor } from '../../entity/Emissor';
import { BoletoService } from '../../service/boleto.service';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-renova-boleto',
  templateUrl: './renova-boleto.component.html',
  styleUrls: [ './renova-boleto.component.scss' ]
})
export class RenovaBoletoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RenovaBoletoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private boletoService: BoletoService,
    private messages: MessageService
  ) {
    this.fg = this.formBuilder.group({
      id: [ null ],
      cliente: [ null, [ Validators.required ] ],
      emissor: [ null, [ Validators.required ] ],
      parcela: [ null, [ Validators.required ] ],
      valor: [ null, [ Validators.required ] ],
      dataPrimeiraParcela: [ null, Validators.required ]
    });

    this.fg.patchValue({ cliente: this.data[ 'cliente' ] });
  }

  boleto: Boleto;
  clientes: Cliente[] = [];
  cliente: Cliente;
  emissor: Emissor;
  prefferedConfig: Config;
  fg: FormGroup;
  dataEscolhida: string;

  ngOnInit() {
    this.messages.add('Load Client-detail-component');
    this.messages.add('Income data: ' + JSON.stringify(this.data));
    this.fg.patchValue({ cliente: this.data[ 'cliente' ] });
    this.fg.patchValue({ emissor: this.data[ 'emissor' ] });
    this.fg.patchValue({ cliente: this.data[ 'cliente' ] });
    this.fg.patchValue({ parcela: this.data[ 'parcela' ] });
    this.fg.patchValue({ valor: this.fg.get('cliente').value.valor });

    const dataPrimeiraParcela: Date = this.data[ 'dataPrimeiraParcela' ];
    const newDate = new Date(dataPrimeiraParcela);
    newDate.setDate(newDate.getDate() + 365);

    this.fg.patchValue({ dataPrimeiraParcela: newDate });

  }

  onSubmit() {
    if (this.fg.valid) {
      this.updateCliente();
    } else {
      this.messages.add('Invalid boleto form: ' + JSON.stringify(this.fg.value));
    }
  }

  updateCliente() {
    const client: Cliente = this.fg.get('cliente').value;
    client.valor = this.fg.get('valor').value;
    this.clienteService.setCliente(client).subscribe(item => {
      this.updateBoleto();
    });
  }

  updateBoleto() {
    this.boletoService.setBoleto(this.fg.value).pipe(
      tap(_ => {
        this.messages.add(`updated ${JSON.stringify(this.fg.value)}`);
        this.dialogRef.close();
        this.boletoService.getBoletoList().subscribe(list => {
          const boleto = list.reduce(function (prev, current) {
            return (prev.id > current.id) ? prev : current;
          });
          this.viewBoleto(boleto);
        });
      }),
      catchError(this.handleError<any>('update'))
    ).subscribe();
  }

  viewBoleto(boleto) {
    this.router.navigate([ '/boleto/' + boleto.id ]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messages.add(error); // log to console instead
      this.messages.add(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  limparForm() {
    this.fg.reset();
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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
