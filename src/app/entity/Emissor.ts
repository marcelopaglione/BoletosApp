import { Cidade } from './Cidade';
import { Estado } from './Estado';
export class Emissor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
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
