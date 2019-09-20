import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Config } from 'src/app/entity/Config';
import { Emissor } from 'src/app/entity/Emissor';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { Router } from '@angular/router';

import { MessageService } from '../../app-common/log-message/message.service';
import { Boleto } from '../../entity/Boleto';
import { Cliente } from '../../entity/Cliente';
import { BoletoService } from '../../service/boleto.service';
import { ConfigService } from '../../service/config.service';
import { BoletoDetailComponent } from '../boleto-detail/boleto-detail.component';

@Component({
  selector: 'app-boleto',
  templateUrl: './boleto.component.html',
  styleUrls: [ './boleto.component.scss' ],
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

  boletos: Boleto[] = [];
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

    this.configService.getConfig().subscribe(data => {
      this.prefferedConfig = data;
      this.initializePageData();
    });
  }

  initializePageData() {
    this.boletoService.getBoletoList().subscribe(data => {
      const boletos = data;
      if (!this.prefferedConfig.hideCompletedBoletos) {
        this.boletos = boletos;
      } else {
        const boletosTemp = [];
        boletos.forEach(boleto => {
          if (!this.verificaBoletoVencido(boleto.dataPrimeiraParcela)) {
            boletosTemp.push(boleto);
          }
        });
        this.boletos = boletosTemp;
      }
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
    if (boleto) {
      this.router.navigate([ '/boleto/' + boleto.id ]);
    }
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
          this.viewBoleto(result[ 0 ]);
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

  verificaBoletoVencido(boletoData: Date): Boolean {
    const difInDays = this.calcDifDays(new Date(boletoData), new Date());
    if (difInDays < -365) {
      return true;
    }
    return false;
  }

  private calcDifDays(data1: Date, data2: Date) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((this.zerarHoras(data1).getTime() - this.zerarHoras(data2).getTime()) / oneDay);
  }

  private zerarHoras(data: Date): Date {
    data.setHours(0);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);
    return data;
  }

  sortData(sort: Sort) {
    const data = this.boletos.slice();
    if (!sort.active || sort.direction === '') {
      this.boletos = data;
      return;
    }

    this.boletos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'ID': return this.compare(a.id, b.id, isAsc);
        case 'Cliente': return this.compare(a.cliente.nome, b.cliente.nome, isAsc);
        case 'Valor': return this.compare(a.cliente.valor, b.cliente.valor, isAsc);
        case 'DataPrimeiraParcela': return this.compare(a.dataPrimeiraParcela.getTime(), b.dataPrimeiraParcela.getTime(), isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
