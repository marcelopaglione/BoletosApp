import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/service/config.service';

import { Config } from '../../entity/Config';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: [ './configuracoes.component.scss' ]
})
export class ConfiguracoesComponent implements OnInit {

  fg: FormGroup;
  config: Config;

  constructor(
    private configService: ConfigService,
    private messages: MessageService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.messages.add('*** Página Config.Componenet aberta ***');
    this.fg = this.formBuilder.group({
      id: [ null, Validators.required ],
      parcelas: [ null, Validators.required ],
      currentdate: [ null, Validators.required ],
      logMessages: [ null, Validators.required ],
      showFormDebug: [ null, Validators.required ],
      verBoletoAutomaticamente: [ null, Validators.required ],
      hideCompletedBoletos: [ null, Validators.required ],

      canhotoWidth: [ null, Validators.required ],
      canhotoHeight: [ null, Validators.required ],
      canhotoBorder: [ null, Validators.required ],
      canhotoPadding: [ null, Validators.required ],
      canhotoFont: [ null, Validators.required ],

      reciboWidth: [ null, Validators.required ],
      reciboHeight: [ null, Validators.required ],
      reciboBorder: [ null, Validators.required ],
      reciboPadding: [ null, Validators.required ],
      reciboFont: [ null, Validators.required ]
    });

    this.configService.getConfig().subscribe(data => {
      this.fg.patchValue(data);
      this.config = data;
      this.messages.add('Patch Value on Init');
    });
    this.messages.add('*** Página Config.Componenet aberta - Init completed ***');
  }

  onSubmit() {
    if (this.fg.valid) {
      this.configService.setConfig(this.fg.value).pipe(
        tap(_ => {
          this.messages.add(`updated ${JSON.stringify(this.fg.value)}`);
        }),
        catchError(this.handleError<any>('update'))
      ).subscribe(_ => {
        this.snackBar.open('Dados salvos com sucesso!', 'Fechar', {
          duration: 5000
        });
      });
    } else {
      this.messages.add('Invalid config form: ' + JSON.stringify(this.fg.value));
    }
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messages.add(error); // log to console instead
      this.messages.add(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  updateFormWithCSS(event) {
    this.fg.patchValue(event);
  }

}
