import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmissorService } from '../../service/emissor.service';
import { Emissor } from '../../entity/Emissor';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-emissor',
  templateUrl: './emissor.component.html',
  styleUrls: ['./emissor.component.scss']
})
export class EmissorComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private emissorService: EmissorService
  ) { }

  fg: FormGroup;
  emissor$: Observable<Emissor>;

  ngOnInit() {

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
    this.emissorService.setEmissor(this.fg.value);
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
