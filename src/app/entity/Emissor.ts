export class Emissor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    numero: string;
    complemento: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}
