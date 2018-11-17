import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    this.headElements = this.clienteService.getTabelaHeaders();
    this.clientes$ = this.clienteService.getClienteList().pipe(
      tap(item => {
        console.log(item);
      })
    );
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
  }

  editar(c: Cliente) {
    this.fg.reset();
    this.fg.patchValue(c);
  }

  onSubmit () {
    if (this.fg.valid) {
      this.clienteService.setCliente(this.fg.value);
    } else {
      this.messages.add('Invalid cliente form: ' + JSON.stringify(this.fg.value));
    }
  }

}
