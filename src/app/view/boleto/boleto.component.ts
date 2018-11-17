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

    this.headElements = this.boletoService.getTabelaHeaders();
    this.boletoService.getBoletoList().subscribe(data => {
      this.boletos = data;
    });
    this.clienteService.getClienteList().subscribe(data => {
      this.clientes = data;
      this.fg.patchValue({ cliente: this.clientes[0] });
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

  limparForm() {
    this.fg.reset();
    this.fg.patchValue({ cliente: this.clientes[0], emissor: this.emissor });
  }

  onSubmit() {
    if (this.fg.valid) {
      this.boletoService.setBoleto(this.fg.value);
      this.limparForm();
    } else {
      this.messages.add('Invalid boleto form: ' + JSON.stringify(this.fg.value));
    }
  }

}
