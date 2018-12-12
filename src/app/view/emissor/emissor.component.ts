import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmissorService } from '../../service/emissor.service';
import { Emissor } from '../../entity/Emissor';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MessageService } from '../../service/message.service';
import { DropdownService } from '../../service/dropdown.service';
import { Estado } from '../../entity/Estado';
import { ConsultaCepService } from '../../service/consulta-cep.service';
import { Cidade } from '../../entity/Cidade';
import { Config } from '../../entity/Config';
import { ConfigService } from '../../service/config.service';
import { MatSnackBar } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-emissor',
  templateUrl: './emissor.component.html',
  styleUrls: ['./emissor.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
  ]
})
export class EmissorComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private emissorService: EmissorService,
    private messages: MessageService,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private configService: ConfigService,
    public snackBar: MatSnackBar
  ) { }

  fg: FormGroup;
  emissor$: Observable<Emissor>;
  cidades$: Observable<Cidade[]>;
  estados$: Observable<Estado[]>;
  config: Config;

  ngOnInit() {
    this.messages.add('*** Página Emissor.Componenet aberta ***');

    this.configService.getConfig().subscribe(data => {
      this.config = data;
    });

    this.estados$ = this.dropdownService.getEstadosBr();

    this.getEmissor();

    this.fg = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.min(3), Validators.max(25)]],
      email: [null, [Validators.email]],
      telefone: [null],
      endereco: this.formBuilder.group({
        id: [null],
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }

  loadCidades() {
    this.cidades$ = this.dropdownService.getCidadesByEstadoId(this.fg.get('endereco.estado').value.id);
  }

  getEmissor() {
    this.emissor$ = this.emissorService.getEmissor().pipe(
      tap(dados => {
        this.updateValues(dados);
        if (this.fg.get('endereco').value) {
          const estadoDoEmissor: Estado = this.fg.get('endereco.estado').value;
          if (estadoDoEmissor) {
            this.messages.add('Carregar Cidades para o estado do emissor: ' + JSON.stringify(estadoDoEmissor));
            this.loadCidades();
          }
        }
      })
    );
  }

  updateValues(emissor: Emissor) {
    this.messages.add('Patch Value Emissor start: ' + JSON.stringify(emissor));
    if (emissor.endereco) {
      this.fg.patchValue(emissor);
    } else {
      this.fg.patchValue({id: emissor.id, nome: emissor.nome, telefone: emissor.telefone, email: emissor.email});
    }
    this.messages.add('Patch Value Emissor end: ' + JSON.stringify(emissor));
  }

  consultaCEP() {
    const cep = this.fg.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.resetaFormularioEndereco();
      this.cepService.consultaCEP(cep)
        .subscribe(dados => {
          if (!dados) {
            this.messages.add(`CEP ${cep} NOT Found`);
          } else {
            this.populaDadosEndereco(dados);
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
            this.fg.patchValue({endereco : {cidade: cidadeEscolhida[0]}});
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

  onSubmit() {
    if (this.fg.valid) {
      this.emissorService.setEmissor(this.fg.value);
      this.snackBar.open('Dados salvos com sucesso!', 'Fechar', {
        duration: 5000
      });
    } else {
      this.messages.add('Invalid emissor form: ' + JSON.stringify(this.fg.value));
    }
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

  verificaEmailInvalid() {
    const campoEmail = this.fg.get('email');
    if (campoEmail.errors) {
      return campoEmail.errors['email'];
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  limparForm() {
    this.fg.reset();
    this.getEmissor();
  }
}
