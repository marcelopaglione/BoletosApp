import { Cliente } from './Cliente';
import { Emissor } from './Emissor';

export class Boleto {
  id: number;
  cliente: Cliente;
  emissor: Emissor;
  parcelas: number;
}
