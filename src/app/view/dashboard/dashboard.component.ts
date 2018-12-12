import { Boleto } from './../../entity/Boleto';
import { BoletoService } from './../../service/boleto.service';
import { element } from 'protractor';
import { Cliente } from './../../entity/Cliente';
import { Dashboard } from './../../entity/Dashboard';
import { ClienteService } from './../../service/cliente.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
