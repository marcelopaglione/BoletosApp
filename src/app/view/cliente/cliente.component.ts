import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../entity/Cliente';
import { ConsultaCepService } from '../../service/consulta-cep.service';
import { Estado } from '../../entity/Estado';
import { DropdownService } from '../../service/dropdown.service';
import { Cidade } from '../../entity/Cidade';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  clientes$: Observable<Cliente[]>;
  estados$: Observable<Estado[]>;
  cidades$: Observable<Cidade[]>;
  headElements: string[] = this.clienteService.getTabelaHeaders();
  fg: FormGroup;
  panelOpenState = false;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private messages: MessageService,
    private cepService: ConsultaCepService,
    private dropdownService: DropdownService,
    public snackBar: MatSnackBar
  ) { }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  ngOnInit() {
    this.messages.add('*** Página Cliente.Componenet aberta ***');

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
    this.initializePageData();
  }

  loadCidades() {
    this.messages.add('Load Cidades triggerd');
    this.cidades$ = this.dropdownService.getCidadesByEstadoId(this.fg.get('endereco.estado').value.id);
  }

  initializePageData(): any {
    this.limparForm();
    this.clientes$ = this.clienteService.getClienteList();
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

  editar(c: Cliente) {
    this.fg.reset();
    this.fg.patchValue(c);
    const estadoDoCliente: Estado = this.fg.get('endereco.estado').value;
    if (estadoDoCliente) {
      this.messages.add('Carregar Cidades para o estado do emissor: ' + JSON.stringify(estadoDoCliente));
      this.loadCidades();
    }
  }

  delete(id) {
    this.messages.add('Perguntando para o user se ele tem certeza da besteira que ele está prestes a fazer: deletar cliente id ' + id);
    this.snackBar.open(`Você realmente deseja deletar cliente com ID ${id} ?`, 'SIM Eu quero!', {
      duration: 5000
    }).onAction().subscribe(data => {
      this.messages.add('Já era!, cliente confirmou deletar cliente id ' + id);
      this.clienteService.deleteById(id).pipe(
        tap(_ => {
          this.messages.add(`deleted id=${id}`);
          this.initializePageData();
        }),
        catchError(this.handleError<any>('delete'))
      ).subscribe();
    });
  }

  onSubmit() {
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
      this.verificaValidacoesForm(this.fg);
    }
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

}
