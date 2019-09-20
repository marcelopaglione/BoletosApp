import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { MessageService } from '../../app-common/log-message/log-message.service';
import { Cidade } from '../../entity/Cidade';
import { Config } from '../../entity/Config';
import { Estado } from '../../entity/Estado';
import { ClienteService } from '../../service/cliente.service';
import { ConfigService } from '../../service/config.service';
import { ConsultaCepService } from '../../service/consulta-cep.service';
import { DropdownService } from '../../service/dropdown.service';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: [ './cliente-detail.component.scss' ]
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
    private configService: ConfigService
  ) { }

  fg: FormGroup;
  estados$: Observable<Estado[]>;
  cidades$: Observable<Cidade[]>;
  config: Config;
  porcentagemConcluida = 0;
  acaoEditarNovo;

  ngOnInit() {
    this.messages.add('Load Client-detail-component');

    this.configService.getConfig().subscribe(data => {
      this.config = data;
    });

    this.estados$ = this.dropdownService.getEstadosBr();
    this.fg = this.formBuilder.group({
      id: [ null ],
      nome: [ null, [ Validators.required, Validators.min(3), Validators.max(25) ] ],
      email: [ null, [ Validators.email ] ],
      telefone: [ null ],
      valor: [ null, Validators.required ],
      endereco: this.formBuilder.group({
        cep: [ null, Validators.required ],
        numero: [ null, Validators.required ],
        complemento: [ null ],
        rua: [ null, Validators.required ],
        bairro: [ null, Validators.required ],
        cidade: [ null, Validators.required ],
        estado: [ null, Validators.required ]
      })
    });

    this.limparForm();

    if (this.data) {
      this.messages.add('Income data: ' + JSON.stringify(this.data));
      const cliente = this.data;
      this.fg.patchValue(cliente);
      const estadoDoCliente: Estado = this.fg.get('endereco.estado').value;
      if (estadoDoCliente) {
        this.messages.add('Carregar Cidades para o estado do emissor: ' + JSON.stringify(estadoDoCliente));
        this.loadCidades();
      }
    }

    this.fg.get('id') ? this.acaoEditarNovo = 'editar' : this.acaoEditarNovo = 'novo';

    this.verificaPorcentagemForm(this.fg, 1);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.fg.valid) {
      this.clienteService.setCliente(this.fg.value).pipe(
        tap(_ => {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.limparForm();
          this.onNoClick();
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
            estado: estadoEscolhido[ 0 ]
          }
        });
        this.verificaPorcentagemForm(this.fg, 1);
        this.dropdownService.getCidadesByName(dados.localidade).subscribe(
          cidadeEscolhida => {
            this.messages.add('cidade escolhida ' + JSON.stringify(cidadeEscolhida));
            this.cidades$ = this.dropdownService.getCidadesByEstadoId(estadoEscolhido[ 0 ].id);
            this.fg.patchValue({ endereco: { cidade: cidadeEscolhida[ 0 ] } });
            this.verificaPorcentagemForm(this.fg, 1);
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

  verificaPorcentagemForm(form: FormGroup, index) {
    if (index === 1) {
      this.porcentagemConcluida = 0;
      this.messages.add('Zerar porcentagem');
    }
    Object.keys(form.controls).forEach(campo => {
      const controle = form.get(campo);
      if (controle instanceof FormGroup) {
        this.verificaPorcentagemForm(controle, (index + 1));
      } else {
        if (controle.value) {
          this.messages.add(controle.value + ' + ' + (100 / (this.acaoEditarNovo === 'editar' ? 11 : 10)));
          this.porcentagemConcluida += (100 / (this.acaoEditarNovo === 'editar' ? 11 : 10));
          this.messages.add('Total: ' + this.porcentagemConcluida);
          if (this.porcentagemConcluida > 100) {
            this.porcentagemConcluida = 100;
          }
        }
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
