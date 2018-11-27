import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Boleto } from '../../entity/Boleto';
import { BoletoService } from '../../service/boleto.service';
import { MessageService } from '../../service/message.service';
import numero from 'numero-por-extenso';
import { Config } from '../../entity/Config';
import { ConfigService } from '../../service/config.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-boleto-view',
  templateUrl: './boleto-view.component.html',
  styleUrls: ['./boleto-view.component.scss']
})
export class BoletoViewComponent implements OnInit {

  @Input() BoletoFake;
  @Output() valueChange = new EventEmitter();

  boletoId;
  boleto: Boleto;
  boletovector: number[] = [];
  config: Config;
  fg: FormGroup;

  step = 1;

  constructor(
    private route: ActivatedRoute,
    private boletoService: BoletoService,
    private messages: MessageService,
    private configService: ConfigService,
    private formBuilder: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      this.boletoId = params.id;
    });

  }

  ngOnInit() {
    // show on Configuration page
    this.fg = this.formBuilder.group({
      id: [null, Validators.required],
      parcelas: [null, Validators.required],
      currentdate: [null, Validators.required],
      logMessages: [null, Validators.required],
      showFormDebug: [null, Validators.required],
      verBoletoAutomaticamente: [null, Validators.required],

      canhotoWidth: [null, Validators.required],
      canhotoHeight: [null, Validators.required],
      canhotoBorder: [null, Validators.required],
      canhotoPadding: [null, Validators.required],
      canhotoFont: [null, Validators.required],

      reciboWidth: [null, Validators.required],
      reciboHeight: [null, Validators.required],
      reciboBorder: [null, Validators.required],
      reciboPadding: [null, Validators.required],
      reciboFont: [null, Validators.required]
    });

    this.boletoService.getBoletoById(this.boletoId).subscribe(data => {
      this.boleto = data;
      this.messages.add('View Boleto: ' + JSON.stringify(this.boleto));
      this.boletovector = [];

      // print only one for testing
      if (this.BoletoFake) {
        this.boletovector.push(0);
      } else {
        for (let index = 0; index < this.boleto.parcela; index++) {
          this.boletovector.push(index);
        }
      }
      // this.print();
    });

    this.configService.getConfig().subscribe(data => {
      this.config = data;
      this.fg.patchValue(data);
    });
  }

  onSubmit() {
    if (this.fg.valid) {
      this.configService.setConfig(this.fg.value).subscribe();
    }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
      <head>
        ${document.getElementById('boletos-header').innerHTML}
      </head>
        <body onload='window.print();window.close()' style='display: flex;justify-content: center;'>${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  somarMes(dataParcela, quantidade) {
    const _dataParcela = new Date(dataParcela);
    _dataParcela.setMonth(_dataParcela.getMonth() + quantidade);
    return _dataParcela;
  }

  extenso(c) {

    return numero.porExtenso(c, numero.estilo.monetario);
  }

  canhoto() {
    return {
      'width': `${this.config.canhotoWidth}mm`,
      'height': `${this.config.canhotoHeight}mm`,
      'border': `${this.config.canhotoBorder}px dashed black`,
      'padding': `${this.config.canhotoPadding}px`,
      'font-size': `${this.config.canhotoFont}%`
    };
  }

  recibo() {
    return {
      'width': `${this.config.reciboWidth}mm`,
      'height': `${this.config.reciboHeight}mm`,
      'border': `${this.config.reciboBorder}px dashed black`,
      'padding': `${this.config.reciboPadding}px`,
      'font-size': `${this.config.reciboFont}%`
    };
  }

  changeV(value) {
    console.log('To patch' + JSON.stringify(value) );
    this.fg.patchValue(value);
    this.config = this.fg.value;
  }

  change() {
    this.config = this.fg.value;
  }

}
