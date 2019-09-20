import { Boleto } from './Boleto';

export class Parcela {
  id: number;
  data: Date;
  boleto: Boleto;
  valor: string;
}
