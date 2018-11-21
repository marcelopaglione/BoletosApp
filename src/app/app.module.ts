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
import { HttpModule } from '@angular/http';
import { FormDebugComponent } from './shared/form-debug/form-debug.component';
import { ConfiguracoesComponent } from './shared/configuracoes/configuracoes.component';
import { ErrorControlComponent } from './shared/error-control/error-control.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import { PhonePipe } from './shared/phone.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatTabsModule,
  MatIconModule, MatSidenavModule, MatListModule, MatCheckboxModule,
  MatGridListModule, MatTableModule, MatFormFieldModule, MatDialogModule, MatProgressBarModule,
  MatInputModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatExpansionModule, MatSnackBarModule
} from '@angular/material';
import { FormInputComponent } from './shared/form-input/form-input.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ClienteDetailComponent } from './view/cliente-detail/cliente-detail.component';
import { BoletoDetailComponent } from './view/boleto-detail/boleto-detail.component';
import { BoletoViewComponent } from './view/boleto-view/boleto-view.component';
registerLocaleData(localeBr);

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    EmissorComponent,
    BoletoComponent,
    NotFoundComponent,
    DashboardComponent,
    NavComponent,
    MessageComponent,
    FormDebugComponent,
    ConfiguracoesComponent,
    ErrorControlComponent,
    PhonePipe,
    BoletoDetailComponent,
    FormInputComponent,
    FooterComponent,
    ClienteDetailComponent,
    BoletoViewComponent
  ],
  imports: [
    BrowserAnimationsModule, MatGridListModule, MatSelectModule, MatExpansionModule, MatSnackBarModule,
    MatCheckboxModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule,
    MatDialogModule, MatProgressBarModule, MatTabsModule,
    MatSortModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  entryComponents: [ClienteDetailComponent, BoletoDetailComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
