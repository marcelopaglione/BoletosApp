import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, Sort } from '@angular/material';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Cliente } from '../../entity/Cliente';
import { ClienteService } from '../../service/cliente.service';
import { MessageService } from '../../service/message.service';
import { ClienteDetailComponent } from '../cliente-detail/cliente-detail.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: [ './cliente.component.scss' ],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
  ]
})
export class ClienteComponent implements OnInit {

  clientes$: Cliente[];
  headElements: string[] = this.clienteService.getTabelaHeaders();

  panelOpenState = false;

  constructor(
    private messages: MessageService,
    private clienteService: ClienteService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.messages.add('*** Página Cliente.Componenet aberta ***');
    this.setClientList();
  }

  setClientList() {
    this.clienteService.getClienteList().subscribe(data => {
      this.clientes$ = data;
    });
  }

  editar(c: Cliente) {
    const dialogRef = this.dialog.open(ClienteDetailComponent, {
      width: '720px',
      data: c
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clienteService.getClienteList().subscribe(data => {
        this.clientes$ = data;
      });
      // console.log('The dialog was closed');
    });
  }

  openDetails(clientEscolhido) {
    console.log('open details novo', clientEscolhido);

    const dialogRef = this.dialog.open(ClienteDetailComponent, {
      width: '720px',
      data: clientEscolhido ? clientEscolhido : null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clienteService.getClienteList().subscribe(data => {
        this.clientes$ = data;
      });
      // console.log('The dialog was closed');
    });
  }

  delete(cliente, event) {
    this.messages.add('Perguntando para o usuário se ele tem certeza da besteira que ele está prestes a fazer: deletar cliente '
      + JSON.stringify(cliente));
    this.snackBar.open(`Deseja deletar cliente ${cliente.nome} ?`, 'SIM Eu quero!', {
      duration: 5000
    }).onAction().subscribe(data => {
      this.messages.add('Já era!, usuário confirmou deletar cliente ' + JSON.stringify(cliente));
      this.clienteService.deleteById(cliente.id).pipe(
        tap(_ => {
          this.messages.add(`deleted id=${cliente.id}`);
          this.setClientList();
        }),
        catchError(this.handleError<any>('delete'))
      ).subscribe(_ => {
        this.snackBar.open(`Cliente ${cliente.nome} deletado!`, 'Fechar', {
          duration: 5000
        });
      });
    });
    event.preventDefault();
    event.stopPropagation();
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.messages.add(error); // log to console instead
      this.messages.add(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  sortData(sort: Sort) {
    const data = this.clientes$.slice();
    if (!sort.active || sort.direction === '') {
      this.clientes$ = data;
      return;
    }

    this.clientes$ = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'ID': return this.compare(a.id, b.id, isAsc);
        case 'Nome': return this.compare(a.nome, b.nome, isAsc);
        case 'Valor': return this.compare(a.valor, b.valor, isAsc);
        case 'Telefone': return this.compare(a.telefone, b.telefone, isAsc);
        case 'Cep': return this.compare(a.endereco.cep, b.endereco.cep, isAsc);
        case 'Rua': return this.compare(a.endereco.rua, b.endereco.rua, isAsc);
        case 'Numero': return this.compare(a.endereco.numero, b.endereco.numero, isAsc);
        case 'Cidade': return this.compare(a.endereco.cidade.nome, b.endereco.cidade.nome, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
