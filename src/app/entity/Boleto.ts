import { Cliente } from './Cliente';
import { Emissor } from './Emissor';

export class Boleto {
  id: string;
  cliente: Cliente;
  emissor: Emissor;
  parcela: number;
  dataPrimeiraParcela: Date;
}
