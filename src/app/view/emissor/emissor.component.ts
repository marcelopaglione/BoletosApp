import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmissorService } from '../../service/emissor.service';
import { Emissor } from '../../entity/Emissor';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MessageService } from '../../service/message.service';
import { DropdownService } from '../../service/dropdown.service';
import { Estado } from '../../entity/Estado';

@Component({
  selector: 'app-emissor',
  templateUrl: './emissor.component.html',
  styleUrls: ['./emissor.component.scss']
})
export class EmissorComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private emissorService: EmissorService,
    private messages: MessageService,
    private dropdownService: DropdownService
  ) { }

  fg: FormGroup;
  emissor$: Observable<Emissor>;
  estados$: Observable<Estado[]>;

  ngOnInit() {

    this.estados$ = this.dropdownService.getEstadosBr();

    this.getEmissor();

    this.fg = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.min(3), Validators.max(25)]],
      email: [null, [Validators.email]],
      telefone: [null],
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

  getEmissor() {
    this.emissor$ = this.emissorService.getEmissor().pipe(
      tap(dados => {
        this.updateValues(dados);
      })
    );
  }

  updateValues(emissor: Emissor) {
    this.fg.patchValue(emissor);
  }

  onSubmit() {
    if (this.fg.valid) {
      this.emissorService.setEmissor(this.fg.value);
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

}
