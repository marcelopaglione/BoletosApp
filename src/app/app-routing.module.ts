import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmissorComponent } from './emissor/emissor.component';
import { ConfiguracoesComponent } from './shared/configuracoes/configuracoes.component';
import { BoletoViewComponent } from './view/boleto-view/boleto-view.component';
import { BoletoComponent } from './view/boleto/boleto.component';
import { ClienteComponent } from './view/cliente/cliente.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { NotFoundComponent } from './view/not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'emissor', component: EmissorComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'boleto', component: BoletoComponent },
  { path: 'configuracoes', component: ConfiguracoesComponent },
  { path: 'boleto/:id', component: BoletoViewComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
