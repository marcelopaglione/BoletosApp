import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Parcela } from 'src/app/entity/Parcela';

import { RenovaBoletoComponent } from '../renova-boleto/renova-boleto.component';
import { Boleto } from './../../entity/Boleto';
import { Cliente } from './../../entity/Cliente';
import { Dashboard } from './../../entity/Dashboard';
import { BoletoService } from './../../service/boleto.service';
import { ClienteService } from './../../service/cliente.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ],
  animations: [
    trigger('fadeInOut1', [
      state(
        'void',
        style({
          opacity: 0
        })
      ),
      transition('void <=> *', animate(300))
    ]),
    trigger('fadeInOut2', [
      state(
        'void',
        style({
          opacity: 0
        })
      ),
      transition('void <=> *', animate(800))
    ]),
    trigger('fadeInOut3', [
      state(
        'void',
        style({
          opacity: 0
        })
      ),
      transition('void <=> *', animate(1000))
    ]),
    trigger('balloonEffect', [
      state(
        'initial',
        style({
          backgroundColor: 'green',
          transform: 'scale(1)'
        })
      ),
      state(
        'final',
        style({
          backgroundColor: 'red',
          transform: 'scale(1.2)'
        })
      ),
      transition('final<=>initial', animate('1000ms'))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard;
  countNParcelas = 5;
  parcelas: Parcela[] = [];
  headElements: string[] = [ 'ID', 'Cliente', 'Valor', 'Data' ];

  constructor(
    private clienteService: ClienteService,
    private boletoService: BoletoService,
    private router: Router,
    public dialogDash: MatDialog
  ) { }

  ngOnInit() {
    this.clienteService.getClienteList().subscribe(data => {
      const clientes: Cliente[] = data;
      this.dashboard = new Dashboard();
      this.dashboard.totalClientes = clientes.length;
      this.dashboard.rendaMensal =
        '' +
        clientes.reduce(
          (accumulator, cliente) =>
            accumulator + +cliente.valor.replace(',', '.'),
          0
        );
    });

    this.boletoService.getBoletoList().subscribe(data => {
      const boletos: Boleto[] = data;
      this.dashboard.totalBoletos = boletos.length;
      const parcelas = [];
      boletos.forEach(item => {
        const p = this.generateParcelas(item);
        if (p) {
          parcelas.push(p);
        }
      });
      parcelas.sort((a, b) => a[ 'data' ] - b[ 'data' ]);
      this.parcelas = parcelas;
    });
  }

  private generateParcelas(boleto: Boleto): Parcela {
    // console.log({'Gerar Parcelas para': boleto.cliente.nome});
    for (let index = 0; index < boleto.parcela; index++) {
      const parcela = new Parcela();
      parcela.boleto = boleto;
      parcela.data = this.somarMes(boleto.dataPrimeiraParcela, index);
      parcela.id = index + 1;
      parcela.valor = boleto.cliente.valor;
      // console.log({'Parcela Calculada': parcela});
      if (this.calcDifDays(parcela.data, new Date()) >= 0) {
        // console.log({ parcela: JSON.stringify(parcela) });
        return parcela;
      }
    }
    return null;
  }

  private somarMes(dataParcela, quantidade): Date {
    const _dataParcela = new Date(dataParcela);
    _dataParcela.setMonth(_dataParcela.getMonth() + quantidade);
    return _dataParcela;
  }

  private styleCardDate(parcela: Parcela): string {
    const difInDays = this.calcDifDays(parcela.data, new Date());
    switch (difInDays) {
      case 0:
        // console.log({'dif red': JSON.stringify(difInDays), 'data': parcela.data});
        return 'red';
      case 1:
        // console.log({'dif orange': JSON.stringify(difInDays), 'data': parcela.data});
        return 'orange';
      default:
        // console.log({'dif blue': JSON.stringify(difInDays), 'data': parcela.data});
        return 'blue';
    }
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

  viewBoleto(boleto) {
    this.router.navigate([ '/boleto/' + boleto.id ]);
  }

  renovaBoleto(c: Boleto) {
    console.log('Renovar boleto' + JSON.stringify(c));
    const dialogRefDash = this.dialogDash.open(RenovaBoletoComponent, {
      width: '720px',
      data: c
    });

    dialogRefDash.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // console.log('The dialog was closed');
    });
  }
}
