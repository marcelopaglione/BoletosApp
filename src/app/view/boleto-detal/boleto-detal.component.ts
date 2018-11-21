import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Boleto } from '../../entity/Boleto';
import { BoletoService } from '../../service/boleto.service';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-boleto-detal',
  templateUrl: './boleto-detal.component.html',
  styleUrls: ['./boleto-detal.component.scss']
})
export class BoletoDetalComponent implements OnInit {

  boletoId;
  boleto: Boleto;
  boletovector: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private boletoService: BoletoService,
    private messages: MessageService) {

    this.route.params.subscribe(params => {

      console.log('set id ' + JSON.stringify(params));
      this.boletoId = params.id;
    });
  }

  ngOnInit() {
    this.boletoService.getBoletoById(this.boletoId).subscribe(data => {
      this.boleto = data;
      this.messages.add('View Boleto: ' + JSON.stringify(this.boleto));
      this.boletovector = [];
      for (let index = 0; index < this.boleto.parcela; index++) {
        this.boletovector.push(index);
      }
      //this.print();
    });


  }

  print(): void {
    let printContents, popupWin;
    console.log(document.getElementById('boletos-header').innerHTML);
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
      <head>
        ${document.getElementById('boletos-header').innerHTML}
      </head>
        <body onload="window.print();window.close()" style="display: flex;justify-content: center;">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
