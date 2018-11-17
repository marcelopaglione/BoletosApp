import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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

  boletos$: Observable<Boleto[]>;

  clientes$: Observable<Cliente[]>;
  emissor$: Observable<Emissor>;

  headElements: string[];
  fg: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private boletoService: BoletoService,
    private clienteService: ClienteService,
    private emissorService: EmissorService,
    private messages: MessageService
  ) { }

  findClienteById(id) {
    // return this.clientes$.map(cliente => id === cliente.id);
  }

  ngOnInit() {
    this.headElements = this.boletoService.getTabelaHeaders();
    this.boletos$ = this.boletoService.getBoletoList();
    this.clientes$ = this.clienteService.getClienteList();
    this.emissor$ = this.emissorService.getEmissor();

    this.fg = this.formBuilder.group({
      id: [null],
      cliente: [null, [Validators.required]],
      emissor: [null, [Validators.required]],
      parcela: [null, [Validators.required]]
    });
  }

  editar(c: Cliente) {
    this.limparForm();
    this.fg.patchValue(c);
  }

  limparForm() {
    this.fg.reset();
  }

  onSubmit () {
    if (this.fg.valid) {
      this.boletoService.setBoleto(this.fg.value);
      this.limparForm();
    } else {
      this.messages.add('Invalid boleto form: ' + JSON.stringify(this.fg.value));
    }
  }

}
