import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Cliente } from '../../entity/Cliente';
import { Boleto } from '../../entity/Boleto';
import { BoletoService } from '../../service/boleto.service';
import { Emissor } from 'src/app/entity/Emissor';
import { ConfigService } from '../../service/config.service';
import { Config } from 'src/app/entity/Config';
import { Router } from '@angular/router';
import { BoletoDetailComponent } from '../boleto-detail/boleto-detail.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-boleto',
  templateUrl: './boleto.component.html',
  styleUrls: ['./boleto.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
  ]
})
export class BoletoComponent implements OnInit {

  boletos: Boleto[];
  clientes: Cliente[] = [];
  emissor: Emissor;
  prefferedConfig: Config;

  headElements: string[] = this.boletoService.getTabelaHeaders();

  constructor(
    private boletoService: BoletoService,
    private messages: MessageService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public configService: ConfigService
  ) { }

  ngOnInit() {
    this.messages.add('*** Página Boleto.Componenet aberta ***');
    this.initializePageData();
    this.configService.getConfig().subscribe(data => {
      this.prefferedConfig = data;
    });
  }

  initializePageData() {
    this.boletoService.getBoletoList().subscribe(data => {
      this.boletos = data;
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  editar(b: Boleto) {
    const dialogRef = this.dialog.open(BoletoDetailComponent, {
      width: '720px',
      data: b
    });

    dialogRef.afterClosed().subscribe(result => {
      this.boletoService.getBoletoList().subscribe(data => {
        this.boletos = data;
      });
      console.log('The dialog was closed');
    });
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messages.add(error); // log to console instead
      this.messages.add(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  delete(element, evento) {
    this.messages.add('Perguntando para o usuário se ele tem certeza da besteira que ele está prestes a fazer: deletar cliente '
      + JSON.stringify(element));
    this.snackBar.open(`Deseja deletar Boleto ${element.id}: ${element.cliente.nome} ?`, 'SIM Eu quero!', {
      duration: 5000
    }).onAction().subscribe(data => {
      this.messages.add('Já era!, usuário confirmou deletar cliente ' + JSON.stringify(element));
      this.boletoService.deleteById(element.id).pipe(
        tap(_ => {
          this.messages.add(`deleted id=${element.id}`);
          this.initializePageData();
        }),
        catchError(this.handleError<any>('delete'))
      ).subscribe(_ => {
        this.snackBar.open(`Boleto ${element.id}: ${element.cliente.nome} deletado!`, 'Fechar', {
          duration: 5000
        });
      });
    });
    event.preventDefault();
    event.stopPropagation();
  }

  viewBoleto(boleto) {
    this.router.navigate(['/boleto/' + boleto.id]);
  }

  openDetails(clientEscolhido) {
    const dialogRef = this.dialog.open(BoletoDetailComponent, {
      width: '720px',
      data: clientEscolhido
    });

    dialogRef.afterClosed().subscribe(result => {
      const boletosBefore = this.boletos;
      this.boletoService.getBoletoList().subscribe(data => {
        this.boletos = data;
        if (this.prefferedConfig.verBoletoAutomaticamente) {
          const boletosAfter = this.boletos;
          const onlyInA = boletosAfter.filter(comparer(boletosBefore));
          const onlyInB = boletosBefore.filter(comparer(boletosAfter));
          result = onlyInA.concat(onlyInB);
          console.log(result);
          this.viewBoleto(result[0]);
        }
      });
    });

    function comparer(otherArray) {
      return function (current) {
        return otherArray.filter(function (other) {
          return other.id === current.id;
        }).length === 0;
      };
    }



  }

}
