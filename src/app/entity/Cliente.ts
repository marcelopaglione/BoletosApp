import { Cidade } from './Cidade';
import { Estado } from './Estado';
export class Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  valor: string;
  endereco: {
    cep: string;
    numero: string;
    complemento: string;
    rua: string;
    bairro: string;
    cidade: Cidade;
    estado: Estado;
  };
}
