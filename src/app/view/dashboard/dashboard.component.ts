import { Boleto } from './../../entity/Boleto';
import { BoletoService } from './../../service/boleto.service';
import { element } from 'protractor';
import { Cliente } from './../../entity/Cliente';
import { Dashboard } from './../../entity/Dashboard';
import { ClienteService } from './../../service/cliente.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeInOut1', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
    trigger('fadeInOut2', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(800)),
    ]),
    trigger('fadeInOut3', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
    trigger('balloonEffect', [
      state('initial', style({
        backgroundColor: 'green',
        transform: 'scale(1)'
      })),
      state('final', style({
        backgroundColor: 'red',
        transform: 'scale(1.2)'
      })),
      transition('final<=>initial', animate('1000ms'))
    ]),
  ]
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard = new Dashboard();

  constructor(
    private clienteService: ClienteService,
    private boletoService: BoletoService
  ) {}

  ngOnInit() {
    this.clienteService.getClienteList().subscribe(data => {
      const clientes: Cliente[] = data;
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
    });
  }
}
