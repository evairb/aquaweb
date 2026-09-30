export type TipoConta = "usuario" | "loja" | "admin";

export interface PerfilUsuario {
  id: number;
  tipo_conta: TipoConta;
  avatar: string | null;
  bio: string;
  nome_loja: string;
  cnpj: string;
  criado_em: string;
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: PerfilUsuario;
}

export interface AuthResponse {
  usuario: Usuario;
  access: string;
  refresh: string;
}

export interface RegistroPayload {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}