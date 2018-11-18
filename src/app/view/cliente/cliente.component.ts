import { Component, OnInit, PipeTransform } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ClienteService } from '../../service/cliente.service';
import { Cliente } from '../../entity/Cliente';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ClienteDetailComponent } from '../cliente-detail/cliente-detail.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
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
    /*this.fg.reset();
    this.fg.patchValue(c);
    const estadoDoCliente: Estado = this.fg.get('endereco.estado').value;
    if (estadoDoCliente) {
      this.messages.add('Carregar Cidades para o estado do emissor: ' + JSON.stringify(estadoDoCliente));
      this.loadCidades();
    }*/
  }

  openDetails(clientEscolhido) {
    const dialogRef = this.dialog.open(ClienteDetailComponent, {
      width: '720px',
      data: clientEscolhido
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  delete(id, event) {
    this.messages.add('Perguntando para o user se ele tem certeza da besteira que ele está prestes a fazer: deletar cliente id ' + id);
    this.snackBar.open(`Você realmente deseja deletar cliente com ID ${id} ?`, 'SIM Eu quero!', {
      duration: 5000
    }).onAction().subscribe(data => {
      this.messages.add('Já era!, cliente confirmou deletar cliente id ' + id);
      this.clienteService.deleteById(id).pipe(
        tap(_ => {
          this.messages.add(`deleted id=${id}`);
          this.setClientList();
          event.preventDefault();
          event.stopPropagation();
        }),
        catchError(this.handleError<any>('delete'))
      ).subscribe(data => {
        event.preventDefault();
        event.stopPropagation();
      });
    });
    event.preventDefault();
    event.stopPropagation();
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      this.messages.add(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messages.add(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
