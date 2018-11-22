import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../service/config.service';
import { MessageService } from '../../service/message.service';
import { Config } from '../../entity/Config';
import { BoletoService } from '../../service/boleto.service';
import { ClienteService } from '../../service/cliente.service';
import { EmissorService } from '../../service/emissor.service';
import { Boleto } from '../../entity/Boleto';
import { Cliente } from '../../entity/Cliente';
import { Emissor } from '../../entity/Emissor';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-boleto-detail',
  templateUrl: './boleto-detail.component.html',
  styleUrls: ['./boleto-detail.component.scss']
})
export class BoletoDetailComponent implements OnInit {

  constructor(
    private messages: MessageService,
    private configService: ConfigService,
    private boletoService: BoletoService,
    private clienteService: ClienteService,
    private emissorService: EmissorService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BoletoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Boleto
  ) { }

  boleto: Boleto;
  clientes: Cliente[] = [];
  emissor: Emissor;
  prefferedConfig: Config;
  fg: FormGroup;
  dataEscolhida: string;

  ngOnInit() {

    this.fg = this.formBuilder.group({
      id: [null],
      cliente: [null, [Validators.required]],
      emissor: [null, [Validators.required]],
      parcela: [null, [Validators.required]],
      valor:  [null, [Validators.required]],
      dataPrimeiraParcela: [null, Validators.required]
    });

    this.initializePageData();

    if (this.data) {
      this.configService.getConfig().subscribe(configData => {
        this.prefferedConfig = configData;
        const boleto = this.data;
        this.fg.patchValue(boleto);
        this.fg.patchValue({valor: boleto.cliente.valor});
        this.boleto = this.data;
      });
    }
  }

  initializePageData() {
    this.limparForm();
    this.clienteService.getClienteList().subscribe(data => {
      this.clientes = data;
    });
    this.emissorService.getEmissor().subscribe(data => {
      this.emissor = data;
      this.fg.patchValue({ emissor: data });

    });
  }

  limparForm() {
    this.fg.reset();
    this.fg.patchValue({ emissor: this.emissor });
    this.configService.getConfig().subscribe(data => {
      this.fg.patchValue({ parcela: data.parcelas });
      if (data.currentdate) {
        this.fg.patchValue({ dataPrimeiraParcela: new Date() });
      }
    });
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

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messages.add(error); // log to console instead
      this.messages.add(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  onSubmit() {
    if (this.fg.valid) {
      this.boletoService.setBoleto(this.fg.value).pipe(
        tap(_ => {
          this.messages.add(`updated ${JSON.stringify(this.fg.value)}`);
          this.initializePageData();
          this.dialogRef.close();
        }),
        catchError(this.handleError<any>('update'))
      ).subscribe();
    } else {
      this.messages.add('Invalid boleto form: ' + JSON.stringify(this.fg.value));
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateValor() {
    const clienteEscolhido: Cliente = this.fg.get('cliente').value;
    this.fg.patchValue({ valor: clienteEscolhido.valor});
  }
}
