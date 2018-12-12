import { Component, OnInit, PipeTransform } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../entity/Cliente';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ClienteDetailComponent } from '../cliente-detail/cliente-detail.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
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
      console.log('The dialog was closed');
    });
  }

  openDetails(clientEscolhido) {
    const dialogRef = this.dialog.open(ClienteDetailComponent, {
      width: '720px',
      data: clientEscolhido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clienteService.getClienteList().subscribe(data => {
        this.clientes$ = data;
      });
      console.log('The dialog was closed');
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
}
