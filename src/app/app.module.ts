import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './view/cliente/cliente.component';
import { EmissorComponent } from './view/emissor/emissor.component';
import { BoletoComponent } from './view/boleto/boleto.component';
import { NotFoundComponent } from './view/not-found/not-found.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { NavComponent } from './shared/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './shared/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    EmissorComponent,
    BoletoComponent,
    NotFoundComponent,
    DashboardComponent,
    NavComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
