import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteComponent } from './view/cliente/cliente.component';
import { BoletoComponent } from './view/boleto/boleto.component';
import { EmissorComponent } from './view/emissor/emissor.component';
import { NotFoundComponent } from './view/not-found/not-found.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { ConfiguracoesComponent } from './shared/configuracoes/configuracoes.component';
import { BoletoDetalComponent } from './view/boleto-detal/boleto-detal.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'emissor', component: EmissorComponent},
  { path: 'cliente', component: ClienteComponent},
  { path: 'boleto', component: BoletoComponent},
  { path: 'configuracoes', component: ConfiguracoesComponent},
  { path: 'boleto/:id', component: BoletoDetalComponent},
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
