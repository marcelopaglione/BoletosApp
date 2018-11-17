import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfigService } from 'src/app/service/config.service';
import { MessageService } from '../../service/message.service';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {

  fg: FormGroup;

  constructor(
    private configService: ConfigService,
    private messages: MessageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.messages.add('*** Página Config.Componenet aberta ***');

    this.fg = this.formBuilder.group({
      parcelas: [null, [Validators.required]]
    });

    this.configService.getConfig().subscribe(data => {
      this.fg.patchValue(data);
    });
  }

  onSubmit() {
    if (this.fg.valid) {
      this.configService.setConfig(this.fg.value).pipe(
        tap(_ => {
          this.messages.add(`updated ${JSON.stringify(this.fg.value)}`);
        }),
        catchError(this.handleError<any>('update'))
      ).subscribe();
    } else {
      this.messages.add('Invalid config form: ' + JSON.stringify(this.fg.value));
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

}
