import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeBr from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppCommonModule } from './app-common/app-common.module';
import { ButtonModule } from './app-common/button/button.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfiguracoesComponent } from './shared/configuracoes/configuracoes.component';
import { DateFormatPipe } from './shared/date.pipe';
import { FormInputComponent } from './shared/form-input/form-input.component';
import { MessageComponent } from './shared/message/message.component';
import { NavComponent } from './shared/nav/nav.component';
import { PhonePipe } from './shared/phone.pipe';
import { BoletoDetailComponent } from './view/boleto-detail/boleto-detail.component';
import { BoletoViewComponent } from './view/boleto-view/boleto-view.component';
import { BoletoComponent } from './view/boleto/boleto.component';
import { ClienteDetailComponent } from './view/cliente-detail/cliente-detail.component';
import { ClienteComponent } from './view/cliente/cliente.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { EmissorComponent } from './view/emissor/emissor.component';
import { NotFoundComponent } from './view/not-found/not-found.component';
import { RenovaBoletoComponent } from './view/renova-boleto/renova-boleto.component';

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
    ConfiguracoesComponent,
    PhonePipe,
    DateFormatPipe,
    BoletoDetailComponent,
    FormInputComponent,
    ClienteDetailComponent,
    BoletoViewComponent,
    RenovaBoletoComponent
  ],
  imports: [
    AppCommonModule,
    ButtonModule,
    BrowserAnimationsModule, MatGridListModule, MatSelectModule, MatExpansionModule, MatSnackBarModule,
    MatCheckboxModule, MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule,
    MatDialogModule, MatProgressBarModule, MatTabsModule, MatDatepickerModule,
    MatSortModule, MatNativeDateModule, MatTooltipModule, MatProgressSpinnerModule, MatBadgeModule,
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
    AppRoutingModule,
    BrowserModule,
    BrowserModule,
    FormsModule
  ],
  entryComponents: [ ClienteDetailComponent, BoletoDetailComponent, RenovaBoletoComponent ],
  providers: [ { provide: LOCALE_ID, useValue: 'pt-BR' } ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
