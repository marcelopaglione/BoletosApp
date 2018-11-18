import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../service/cliente.service';
import { MessageService } from '../../service/message.service';
import { ConsultaCepService } from '../../service/consulta-cep.service';
import { DropdownService } from '../../service/dropdown.service';
import { Observable, of } from 'rxjs';
import { Estado } from '../../entity/Estado';
import { Cidade } from '../../entity/Cidade';
import { catchError, tap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.scss']
})
export class ClienteDetailComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ClienteDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private messages: MessageService,
    private cepService: ConsultaCepService,
    private dropdownService: DropdownService,
  ) { }

  fg: FormGroup;
  estados$: Observable<Estado[]>;
  cidades$: Observable<Cidade[]>;

  ngOnInit() {

    this.estados$ = this.dropdownService.getEstadosBr();
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

    this.limparForm();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('submmit ciente-detail-componenet');
    console.log(event);
    if (this.fg.valid) {
      this.clienteService.setCliente(this.fg.value).pipe(
        tap(_ => {
          event.preventDefault();
          event.stopImmediatePropagation();
          console.log(`Cliente Updated ${JSON.stringify(this.fg.value)}`);
          this.limparForm();
          console.log(`limparForm`);
          this.onNoClick();
          console.log(`fecharForm`);

        }),
        catchError(this.handleError<any>('update'))
      ).subscribe();
    } else {
      console.log('Invalid cliente form: ' + JSON.stringify(this.fg.value));
      this.verificaValidacoesForm(this.fg);
    }
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

  loadCidades() {
    this.messages.add('Load Cidades triggerd');
    this.cidades$ = this.dropdownService.getCidadesByEstadoId(this.fg.get('endereco.estado').value.id);
  }

  limparForm() {
    this.fg.reset();
  }

  consultaCEP() {
    const cep = this.fg.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.resetaFormularioEndereco();
      this.cepService.consultaCEP(cep)
        .subscribe(dados => {
          const cepfound: any = dados;
          if (cepfound.erro) {
            this.messages.add(`CEP ${cep} NOT Found`);
          } else {
            this.populaDadosEndereco(cepfound);
          }
        });
    }
  }

  // sorry for this ugly method, but it is working so far =(
  populaDadosEndereco(dados) {
    this.dropdownService.getEstadosByUf(dados.uf).subscribe(
      estadoEscolhido => {
        this.messages.add('estado escolhida ' + JSON.stringify(estadoEscolhido));
        this.fg.patchValue({
          endereco: {
            rua: dados.logradouro,
            complemento: dados.complemento,
            bairro: dados.bairro,
            estado: estadoEscolhido[0]
          }
        });
        this.dropdownService.getCidadesByName(dados.localidade).subscribe(
          cidadeEscolhida => {
            this.messages.add('cidade escolhida ' + JSON.stringify(cidadeEscolhida));
            this.cidades$ = this.dropdownService.getCidadesByEstadoId(estadoEscolhido[0].id);
            this.fg.patchValue({ endereco: { cidade: cidadeEscolhida[0] } });
          }
        );
      }
    );
  }

  resetaFormularioEndereco() {
    this.fg.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
        numero: null
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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

}
